import rateLimit from 'express-rate-limit';

export const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 analysis requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'You have reached the maximum analysis rate limit. Please try again in 15 minutes.'
  }
});
