/**
 * SurSetu 2.0 - Offline Activity Audit Logging & 14-Day Telemetry Engine
 * ----------------------------------------------------------------------
 * Records local classroom pedagogical events (reading minutes, worksheets printed,
 * speech recognition decodes, and translation queries) without sending telemetry to the cloud.
 * Provides rolling 14-day aggregation for District / CRP audit compliance.
 */

export type AuditEventType =
  | 'story_read'
  | 'speech_asr'
  | 'translation_query'
  | 'worksheet_print'
  | 'quiz_completed'
  | 'role_switch'
  | 'vocabulary_learned';

export interface AuditLogEntry {
  id: string;
  type: AuditEventType;
  timestamp: number;
  dateStr: string; // YYYY-MM-DD
  userRole: string;
  details: Record<string, any>;
}

export interface DayTelemetry {
  date: string;
  readingMinutes: number;
  worksheetsPrinted: number;
  translationsCount: number;
  quizzesCompleted: number;
  speechTranscriptsCount: number;
}

const STORAGE_KEY = 'sursetu_activity_audit_logs_v2';
const MAX_LOG_ENTRIES = 500;

class AuditLogger {
  private logs: AuditLogEntry[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadLogs();
    }
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch {
      this.logs = [];
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
    } catch {
      // ignore
    }
  }

  /**
   * Log an event
   */
  public log(type: AuditEventType, userRole: string, details: Record<string, any> = {}) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const entry: AuditLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      timestamp: Date.now(),
      dateStr,
      userRole,
      details,
    };

    this.logs.unshift(entry);
    if (this.logs.length > MAX_LOG_ENTRIES) {
      this.logs.pop();
    }
    this.saveLogs();
  }

  /**
   * Get 14-Day Rolling Telemetry Summary
   */
  public get14DayTelemetry(): DayTelemetry[] {
    const daysMap: Record<string, DayTelemetry> = {};
    const now = new Date();

    // Populate last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      daysMap[dStr] = {
        date: dStr,
        readingMinutes: 0,
        worksheetsPrinted: 0,
        translationsCount: 0,
        quizzesCompleted: 0,
        speechTranscriptsCount: 0,
      };
    }

    this.logs.forEach((log) => {
      if (daysMap[log.dateStr]) {
        if (log.type === 'story_read') daysMap[log.dateStr].readingMinutes += log.details.durationMinutes || 3;
        if (log.type === 'worksheet_print') daysMap[log.dateStr].worksheetsPrinted += 1;
        if (log.type === 'translation_query') daysMap[log.dateStr].translationsCount += 1;
        if (log.type === 'quiz_completed') daysMap[log.dateStr].quizzesCompleted += 1;
        if (log.type === 'speech_asr') daysMap[log.dateStr].speechTranscriptsCount += 1;
      }
    });

    return Object.values(daysMap);
  }

  /**
   * Get all raw logs
   */
  public getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all audit logs
   */
  public clearLogs() {
    this.logs = [];
    this.saveLogs();
  }
}

export const auditLogger = new AuditLogger();
