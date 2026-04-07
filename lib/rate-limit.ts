const store = new Map<string, { count: number; resetTime: number }>();

// Clean expired entries every 5 minutes
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 300_000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetTime) store.delete(key);
  }
}

export function rateLimit(
  identifier: string,
  { maxAttempts, windowMs }: { maxAttempts: number; windowMs: number }
): { success: boolean; remaining: number } {
  cleanup();
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxAttempts - 1 };
  }

  entry.count++;
  if (entry.count > maxAttempts) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: maxAttempts - entry.count };
}
