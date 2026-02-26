export type ToolContext = {
  userIntent: string;
};

export type Tool = {
  name: string;
  execute: (payload: any, ctx: ToolContext) => Promise<any>;
};