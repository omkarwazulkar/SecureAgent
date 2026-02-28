import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../config/redis";
import { metrics } from "../monitoring/metrics";

export function createAgentRateLimiter() {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) =>
        redisClient.sendCommand(args as any),
    }),
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      metrics.rateLimited++;
      res.status(429).json({
        action: "REFUSE",
        reasoning: "Too Many Requests. Please Slow Down.",
      });
    },
  });
}