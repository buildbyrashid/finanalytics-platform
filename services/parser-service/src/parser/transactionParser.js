import { cleanLine } from "../utils/cleanText.js";

export function parseTransactions(pages) {
  let transactions = [];

  const paidRegex = /Paid to (.+)/i;
  const receivedRegex = /Received from (.+)/i;
  const amountRegex = /₹\s?([0-9,]+\.\d+|[0-9,]+)/;

  for (const page of pages) {
    const lines = page.split("\n");

    for (let line of lines) {
      line = cleanLine(line);

      let type = null;
      let merchant = null;

      if (paidRegex.test(line)) {
        type = "PAID";
        merchant = line.match(paidRegex)[1].trim();
      } else if (receivedRegex.test(line)) {
        type = "RECEIVED";
        merchant = line.match(receivedRegex)[1].trim();
      }

      if (!merchant) continue;

      const amountMatch = line.match(amountRegex);
      if (!amountMatch) continue;

      const amount = parseFloat(amountMatch[1].replace(/,/g, ""));

      transactions.push({
        type,
        merchant,
        amount
      });
    }
  }

  return transactions;
}
