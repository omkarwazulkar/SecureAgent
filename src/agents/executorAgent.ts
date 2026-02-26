import { getTool } from "../tools/registry";
import { auditLog } from "../audit/logger";

export async function executorAgent(
  payload: any,
  context: { requestId: string }
) {
  const { tool, args } = payload;
  const { requestId } = context;

  if (typeof tool !== "string") {
    auditLog({
      requestId,
      timestamp: new Date().toISOString(),
      action: "EXECUTE",
      outcome: "DENIED",
      reason: "Invalid tool format"
    });

    throw new Error("Invalid tool request");
  }

  const allowedTool = getTool(tool);

  if (!allowedTool) {
    auditLog({
      requestId,
      timestamp: new Date().toISOString(),
      action: "EXECUTE",
      tool,
      outcome: "DENIED",
      reason: "Tool not registered"
    });

    throw new Error("Tool not allowed");
  }

  auditLog({
    requestId,
    timestamp: new Date().toISOString(),
    action: "EXECUTE",
    tool,
    outcome: "ALLOWED"
  });

  return allowedTool.execute(args, {
    userIntent: tool
  });
}