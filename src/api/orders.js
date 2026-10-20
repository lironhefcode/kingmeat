// Order submission seam. There is no backend yet: orders are kept in this
// browser's sessionStorage so the confirmation page can show them.
// TODO: replace both functions with calls to the real orders API.

const KEY = "kingmeat-orders";

function readAll() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

export async function placeOrder(order) {
  const id = String(Math.floor(100000 + Math.random() * 900000));
  const saved = { ...order, id, createdAt: new Date().toISOString() };
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...readAll(), [id]: saved }));
  } catch {
    // Without storage the confirmation page can't reload the order, but submission still succeeds
  }
  await new Promise((r) => setTimeout(r, 600));
  return saved;
}

export function getOrder(id) {
  return readAll()[id] ?? null;
}
