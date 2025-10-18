/**
 * Token bucket rate limiter per IP + path
 * 60 requests per 10 minutes per IP+path combination
 */

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const RATE_LIMIT_TOKENS = 60;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const REFILL_RATE = RATE_LIMIT_TOKENS / RATE_LIMIT_WINDOW_MS; // tokens per millisecond

// In-memory store: Map<"IP:PATH", TokenBucket>
const buckets = new Map<string, TokenBucket>();

/**
 * Create a bucket key from IP and path
 */
function getBucketKey(ip: string, path: string): string {
  return `${ip}:${path}`;
}

/**
 * Refill tokens based on elapsed time
 */
function refillBucket(bucket: TokenBucket): void {
  const now = Date.now();
  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = elapsed * REFILL_RATE;
  
  bucket.tokens = Math.min(RATE_LIMIT_TOKENS, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;
}

/**
 * Check if request is allowed and consume a token
 * Returns true if allowed, false if rate limited
 */
export function checkRateLimit(ip: string, path: string): boolean {
  const key = getBucketKey(ip, path);
  
  // Get or create bucket
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = {
      tokens: RATE_LIMIT_TOKENS,
      lastRefill: Date.now()
    };
    buckets.set(key, bucket);
  }
  
  // Refill tokens based on time elapsed
  refillBucket(bucket);
  
  // Check if we have tokens available
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true;
  }
  
  return false;
}

/**
 * Clean up old buckets (optional maintenance function)
 * Call periodically to prevent memory leaks
 */
export function cleanupOldBuckets(): void {
  const now = Date.now();
  const maxAge = RATE_LIMIT_WINDOW_MS * 2; // Keep buckets for 20 minutes
  
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.lastRefill > maxAge && bucket.tokens >= RATE_LIMIT_TOKENS) {
      buckets.delete(key);
    }
  }
}

// Cleanup every 30 minutes in production
if (typeof global !== 'undefined' && process.env.NODE_ENV === 'production') {
  setInterval(cleanupOldBuckets, 30 * 60 * 1000);
}
