export function formatMenuPrice(price: number | null): string {
  if (price === null) {
    return "—";
  }

  return `$${price.toFixed(2)}`;
}
