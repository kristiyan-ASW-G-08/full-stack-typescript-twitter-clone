import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { RESTError, errors } from '../utilities/RESTError';

const idRateLimiter = new RateLimiterMemory({
  keyPrefix: 'middleware',
  points: 10,
  duration: 1,
});

const rateLimiter = async (
  { ip }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await idRateLimiter.consume(ip);
    next();
  } catch (err) {
    const { status, message } = errors.TooManyRequests;
    throw new RESTError(status, message);
  }
};
export default rateLimiter;
