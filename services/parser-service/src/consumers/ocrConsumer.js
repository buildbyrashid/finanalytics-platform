import { Kafka } from "kafkajs";
import { parseTransactions } from "../parser/transactionParser.js";

const kafka = new Kafka({
  clientId: "parser-service",
  brokers: ["kafka:9092"]
});

const consumer = kafka.consumer({ groupId: "parser-service" });
const producer = kafka.producer();

export async function startOCRConsumer() {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({ topic: "pdf.ocr.completed", fromBeginning: false });

  console.log("📥 Listening to pdf.ocr.completed...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      console.log("📄 OCR Completed Event:", event);

      const userId = event.userId;
      const fileKey = event.fileKey;
      const pages = event.pages;

      const extracted = parseTransactions(pages);

      await producer.send({
        topic: "transactions.parsed",
        messages: [
          {
            value: JSON.stringify({
              eventType: "transactions.parsed",
              userId,
              fileKey,
              transactions: extracted
            })
          }
        ]
      });

      console.log("✅ Published transactions.parsed");
    }
  });
}
