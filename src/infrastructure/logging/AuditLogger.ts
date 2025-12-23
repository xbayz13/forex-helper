/**
 * AuditLogger
 * Service for logging user activities and system events
 */

export interface AuditLogEntry {
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  status: "success" | "failure";
}

export interface AuditLogger {
  log(entry: AuditLogEntry): Promise<void>;
  logAction(
    action: string,
    resource: string,
    userId?: string,
    details?: Record<string, unknown>
  ): Promise<void>;
}

export class ConsoleAuditLogger implements AuditLogger {
  async log(entry: AuditLogEntry): Promise<void> {
    const logMessage = {
      timestamp: entry.timestamp.toISOString(),
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      details: entry.details,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      status: entry.status,
    };

    console.log(`[AUDIT] ${JSON.stringify(logMessage, null, 2)}`);
  }

  async logAction(
    action: string,
    resource: string,
    userId?: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      timestamp: new Date(),
      userId,
      action,
      resource,
      details,
      status: "success",
    });
  }
}

