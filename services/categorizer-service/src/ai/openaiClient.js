import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askAIForCategory(merchant, amount) {
  const prompt = `
Category classify this transaction:
Merchant: ${merchant}
Amount: ${amount}

Categories: Food, Transport, Shopping, Groceries, Health, Bills, Entertainment, Personal Transfer, Others.
Respond with only category name.
  `;

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });

  return response.choices[0].message.content.trim();
}
