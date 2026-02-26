import { metrics } from "../monitoring/metrics";

const MAX_INPUT_LENGTH = 500; 

export function validateInput(input: unknown): {
  valid: boolean;
  reason?: string;
} {

  metrics.totalRequests++  
  if (typeof input !== "string") {
    return { valid: false, reason: "Input Must Be A String" };
  }

  if (input.trim().length === 0) {
    return { valid: false, reason: "Input Cannot Be Empty" };
  }

  if (input.length > MAX_INPUT_LENGTH) {
    return { valid: false, reason: "Input Too Long" };
  }

  const base64Pattern = /^[A-Za-z0-9+/=]+$/;
  if (input.length > 200 && base64Pattern.test(input)) {
    return { valid: false, reason: "Suspicious Encoded Content" };
  }

  return { valid: true };
}