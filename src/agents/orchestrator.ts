import OpenAI from "openai";
import dotenv from "dotenv";
import { sanitizeUserInput } from "../gateway/sanitize";
import { validateAgentOutput } from "../schemas/validate";
import { readerAgent } from "./readerAgent";
import { executorAgent } from "./executorAgent";
import { auditLog } from "../audit/logger";
import crypto from "crypto";
import { metrics } from "../monitoring/metrics";

const requestId = crypto.randomUUID();
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function orchestrate(userInput: string) {
    const sanitizedInput = sanitizeUserInput(userInput);
    const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "system",
                content: process.env.SYSTEM_PROMPT!
            },
            {
                role: "user",
                content: sanitizedInput
            }
        ]
    });

    metrics.llmCalls++;
    console.log("System Prompt: ", process.env.SYSTEM_PROMPT);

    const rawText = response.output_text;
    console.log("Raw Text: ", rawText)
    let rawObject: unknown;
    try {
        rawObject = JSON.parse(rawText);
    } catch {
        throw new Error("Model did not return valid JSON");
    }
    const validated = validateAgentOutput(rawObject);

    auditLog({
        requestId,
        timestamp: new Date().toISOString(),
        action: validated.action,
        outcome:
            validated.action === "REFUSE" ? "DENIED" : "ALLOWED",
        reason: validated.reasoning
    });

    switch (validated.action) {
        case "READ":
            metrics.actionRead++
            return readerAgent(validated.payload);

        case "EXECUTE":
            metrics.actionExecute++
            return executorAgent(validated.payload, { requestId });

        case "REFUSE":
            metrics.actionRefuse++
            return {
                action: "REFUSE",
                reasoning: validated.reasoning
            };

        default:
            throw new Error("Unknown action");
    }
}