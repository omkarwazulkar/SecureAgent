import { AgentResponseSchema, AgentResponse } from "./agentResponse";

export function validateAgentOutput(raw: unknown): AgentResponse {
  const parsed = AgentResponseSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error("Invalid Agent Output Schema");
  }

  return parsed.data;
}