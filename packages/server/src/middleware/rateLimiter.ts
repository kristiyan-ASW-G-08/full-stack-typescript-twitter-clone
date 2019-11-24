import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { CustomError, errors } from '@utilities/CustomError';

const idRateLimiter = new RateLimiterMemory({
  keyPrefix: 'middleware',
  points: 10,
  duration: 1,
});

const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await idRateLimiter.consume(req.ip);
    next();
  } catch (err) {
    const { status, message } = errors.TooManyRequests;
    const error = new CustomError(status, message);
    throw error;
  }
};
export default rateLimiter;
