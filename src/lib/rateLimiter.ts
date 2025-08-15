// Simple client-side rate limiting for additional security
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(attempt => now - attempt < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }

  getRemainingAttempts(key: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const validAttempts = attempts.filter(attempt => now - attempt < this.windowMs);
    return Math.max(0, this.maxAttempts - validAttempts.length);
  }

  getTimeUntilReset(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const resetTime = oldestAttempt + this.windowMs;
    return Math.max(0, resetTime - Date.now());
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Create rate limiters for different actions
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const signupRateLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour
export const contactRateLimiter = new RateLimiter(3, 10 * 60 * 1000); // 3 submissions per 10 minutes

// Utility function to get client identifier (IP simulation)
export const getClientIdentifier = (): string => {
  // In a real app, you'd use the actual IP address from your backend
  // For client-side rate limiting, we'll use a browser fingerprint
  return `${navigator.userAgent}_${navigator.language}_${screen.width}x${screen.height}`;
};
