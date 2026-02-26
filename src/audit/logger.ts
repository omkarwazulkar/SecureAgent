export type AuditEvent = {
  requestId: string;
  timestamp: string;
  action: "READ" | "EXECUTE" | "REFUSE";
  tool?: string;
  outcome: "ALLOWED" | "DENIED";
  reason?: string;
};

export function auditLog(event: AuditEvent) {
  console.log("🔐 AUDIT", JSON.stringify(event));
}