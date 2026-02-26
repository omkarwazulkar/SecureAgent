export function mockAgentResponse() {
  return {
    action: "READ",
    reasoning: "User asked for information",
    payload: {
      message: "This is a safe, structured response"
    }
  };
}