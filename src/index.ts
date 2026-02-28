import express from "express";
import dotenv from "dotenv";
import { loadSystemPrompt } from "./policy/systemPrompt";
import { orchestrate } from "./agents/orchestrator";
import { registerTool } from "./tools/registry";
import { timeTool } from "./tools/timeTool";
import { createAgentRateLimiter } from "./middleware/rateLimit";
import { detectAbuse } from "./security/abuseDetector";
import { validateInput } from "./security/inputValidator";
import { metrics } from "./monitoring/metrics";
import { connectRedis } from "./config/redis";

dotenv.config();

async function startServer() {
  try {
    await connectRedis();

    registerTool(timeTool);

    const SYSTEM_PROMPT = loadSystemPrompt();
    process.env.SYSTEM_PROMPT = SYSTEM_PROMPT;

    console.log("📏 System Prompt Length:", SYSTEM_PROMPT.length);

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.json());

    const agentRateLimiter = createAgentRateLimiter();

    app.get("/health", (_req, res) => {
      res.json({ status: "Agent Running OK" });
    });

    app.post("/agent/orchestrate", agentRateLimiter, async (req, res) => {
      try {
        const input = req.body?.input;

        const validation = validateInput(input);

        if (!validation.valid) {
          metrics.validationBlocked++;
          return res.status(400).json({
            action: "REFUSE",
            reasoning: validation.reason,
          });
        }

        const abuseCheck = detectAbuse(input);

        if (abuseCheck.isAbusive) {
          metrics.abuseBlocked++;
          return res.status(403).json({
            action: "REFUSE",
            reasoning: "Request Blocked By Abuse Detection",
          });
        }

        const result = await orchestrate(input);
        res.json(result);

      } catch (err) {
        res.status(500).json({
          error: (err as Error).message,
        });
      }
    });

    app.get("/metrics", (_req, res) => {
      res.json(metrics);
    });

    app.listen(Number(port), "0.0.0.0", () => {
      console.log(`🚀 Secure Agent Running On Port ${port}`);
    });

  } catch (err) {
    console.error("❌ Failed To Start Server:", err);
    process.exit(1);
  }
}

startServer();