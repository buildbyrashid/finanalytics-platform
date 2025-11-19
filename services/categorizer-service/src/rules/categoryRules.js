export function applyRules(merchant, amount) {
  const lower = merchant.toLowerCase();

  if (lower.includes("restaurant") || lower.includes("biryani") || lower.includes("hotel"))
    return "Food";

  if (lower.includes("petrol") || lower.includes("oil") || lower.includes("fuel"))
    return "Transport";

  if (lower.includes("medical") || lower.includes("clinic") || lower.includes("hospital"))
    return "Health";

  if (lower.includes("mobile") || lower.includes("electronics"))
    return "Shopping";

  if (lower.includes("supermarket") || lower.includes("store"))
    return "Groceries";

  return null; // no match → fallback to AI
}
