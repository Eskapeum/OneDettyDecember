// Mock implementation for Redis
// This will be replaced with actual implementation

export const redis = {
  get: () => Promise.resolve(null),
  set: () => Promise.resolve('OK'),
  setex: () => Promise.resolve('OK'),
  del: () => Promise.resolve(1),
}

// Placeholder for actual implementation
export default redis
