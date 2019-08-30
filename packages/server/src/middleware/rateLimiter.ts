import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { CustomError, errors } from '@utilities/CustomError';

const { REDIS_PORT, REDIS_HOST } = process.env;
const redisClient = new Redis({ port: REDIS_PORT, host: REDIS_HOST });
const idRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 10,
  duration: 1,
});

const rateLimiter = (): ((
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>) => {
  return async (req, res, next): Promise<void> => {
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
