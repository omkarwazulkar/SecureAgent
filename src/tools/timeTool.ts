import { Tool } from "./types";

export const timeTool: Tool = {
  name: "get_current_time",
  execute: async () => {
    return {
      now: new Date().toISOString()
    };
  }
};