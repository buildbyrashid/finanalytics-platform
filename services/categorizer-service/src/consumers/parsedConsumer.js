import { Kafka } from "kafkajs";
import redis from "../redis/redisClient.js";
import { applyRules } from "../rules/categoryRules.js";
import { askAIForCategory } from "../ai/openaiClient.js";
import { publishCategorized } from "../producers/categorizedProducer.js";

const kafka = new Kafka({
  clientId: "categorizer-service",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"]
});

const consumer = kafka.consumer({ groupId: "categorizer-service" });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "transactions.parsed" });

  console.log("📥 Waiting for parsed transactions...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      const { userId, fileKey, transactions } = event;

      const result = [];

      for (const t of transactions) {
        const { merchant, amount } = t;

        // 1️⃣ Check Redis cache first
        const cached = await redis.get(`merchant:${merchant}`);
        if (cached) {
          result.push({ ...t, category: cached, source: "cache" });
          continue;
        }

        // 2️⃣ Rule-based category
        const ruleCategory = applyRules(merchant, amount);
        if (ruleCategory) {
          await redis.set(`merchant:${merchant}`, ruleCategory);
          result.push({ ...t, category: ruleCategory, source: "rules" });
          continue;
        }

        // 3️⃣ AI fallback
        const aiCategory = await askAIForCategory(merchant, amount);
        await redis.set(`merchant:${merchant}`, aiCategory);

        result.push({ ...t, category: aiCategory, source: "ai" });
      }

      await publishCategorized(userId, fileKey, result);
    }
  });
}
