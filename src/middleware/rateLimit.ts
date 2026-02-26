import rateLimit from "express-rate-limit";
import { metrics } from "../monitoring/metrics";

export const agentRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    metrics.rateLimited++
    res.status(429).json({
      action: "REFUSE",
      reasoning: "Too many requests. Please slow down."
    });
  }
});