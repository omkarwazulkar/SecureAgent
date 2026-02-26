const BLOCK_PATTERNS: RegExp[] = [
  /ignore (all|previous) instructions/i,
  /reveal (system|developer) prompt/i,
  /show (system|developer) prompt/i,
  /you are now the system/i,
  /override (rules|instructions)/i,
  /use tool/i,
  /execute .*command/i,
  /rm -rf/i,
  /delete all files/i
];

export function detectAbuse(input: string): {
  isAbusive: boolean;
  reason?: string;
} {
  for (const pattern of BLOCK_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isAbusive: true,
        reason: `Matched abuse pattern: ${pattern.toString()}`
      };
    }
  }

  return { isAbusive: false };
}