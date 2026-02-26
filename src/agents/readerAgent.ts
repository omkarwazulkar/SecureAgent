export async function readerAgent(payload: any) {
  // strictly read-only behavior
  return {
    result: payload
  };
}