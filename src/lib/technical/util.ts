/**
 * Utility functions for ID generation, timestamps, normalization, and pagination
 */

/**
 * Generate a unique ID using a simple nanoid-like implementation
 */
export function nanoid(size: number = 21): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  let id = '';
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] & 63];
  }
  return id;
}

/**
 * Get current timestamp in ISO 8601 format
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * Normalize topic tags to lowercase and deduplicate
 */
export function normalizeTags(tags: string[]): string[] {
  const normalized = tags.map(tag => tag.toLowerCase().trim()).filter(Boolean);
  return [...new Set(normalized)];
}

/**
 * Calculate pagination metadata
 */
export function paginate<T>(
  items: T[],
  offset: number = 0,
  limit: number = 50
): {
  items: T[];
  total: number;
  nextOffset?: number;
} {
  const total = items.length;
  const paginatedItems = items.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return {
    items: paginatedItems,
    total,
    ...(hasMore && { nextOffset: offset + limit })
  };
}

/**
 * Sanitize string by trimming whitespace
 */
export function sanitizeString(str: string): string {
  return str.trim();
}

/**
 * Basic PII scrubbing for emails and phone numbers
 */
export function scrubPII(text: string): string {
  // Remove email addresses
  let scrubbed = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]');
  
  // Remove phone numbers (various formats)
  scrubbed = scrubbed.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');
  scrubbed = scrubbed.replace(/\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');
  scrubbed = scrubbed.replace(/\b\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[PHONE_REDACTED]');
  
  return scrubbed;
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get client IP from request headers (supports various proxies)
 */
export function getClientIP(headers: Headers): string {
  // Check common proxy headers
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback to a default
  return 'unknown';
}
