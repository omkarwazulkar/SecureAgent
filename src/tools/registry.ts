import { Tool } from "./types";

const tools = new Map<string, Tool>();

export function registerTool(tool: Tool) {
  tools.set(tool.name, tool);
}

export function getTool(name: string): Tool | undefined {
  return tools.get(name);
}