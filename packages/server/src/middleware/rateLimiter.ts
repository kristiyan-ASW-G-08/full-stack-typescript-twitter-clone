import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { CustomError, errors } from '@utilities/CustomError';

const idRateLimiter = new RateLimiterMemory({
  keyPrefix: 'middleware',
  points: 10,
  duration: 1,
});

const rateLimiter = (): ((
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>) => {
  return async (req: Request): Promise<void> => {
    try {
      const { ip } = req;
      await idRateLimiter.consume(ip);
    } catch (err) {
      const { status, message } = errors.TooManyRequests;
      const error = new CustomError(status, message);
      throw error;
    }
  };
};
export default rateLimiter;
