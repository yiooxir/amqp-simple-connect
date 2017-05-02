export function stringHash(length = 9) {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
}
