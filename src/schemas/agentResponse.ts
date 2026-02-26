import { z } from "zod";

export const AgentActionEnum = z.enum([
  "READ",
  "EXECUTE",
  "REFUSE"
]);

export const AgentResponseSchema = z.object({
  action: AgentActionEnum,
  reasoning: z.string().min(1),
  payload: z.record(z.string(), z.any()).optional()
});

export type AgentResponse = z.infer<typeof AgentResponseSchema>;