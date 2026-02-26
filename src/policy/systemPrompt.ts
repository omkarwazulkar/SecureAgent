import fs from "fs";
import path from "path";

export function loadSystemPrompt(): string {
  const promptPath = path.join(
    __dirname,
    "../config/systemPrompt.txt"
  );

  if (!fs.existsSync(promptPath)) {
    throw new Error("systemPrompt.txt not found");
  }

  const prompt = fs.readFileSync(promptPath, "utf-8").trim();

  if (!prompt) {
    throw new Error("systemPrompt.txt is empty");
  }

  return prompt;
}