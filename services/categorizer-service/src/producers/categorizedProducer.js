import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "categorizer-service",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"]
});

const producer = kafka.producer();
await producer.connect();

export async function publishCategorized(userId, fileKey, transactions) {
  await producer.send({
    topic: "transactions.categorized",
    messages: [
      {
        value: JSON.stringify({
          eventType: "transactions.categorized",
          userId,
          fileKey,
          transactions
        })
      }
    ]
  });

  console.log("✅ Published categorized transactions");
}
