import {
    AuditUserRole,
    StoredAuditReport,
    StoredAuditReportFinding,
    AuditRoleActionLog
  } from '../core/general/general.types';
  
  /**
   * Recalculate the summary statistics for a given audit report.
   */
  export function recalculateAuditReportSummary(report: StoredAuditReport): StoredAuditReport['summary'] {
    const severityCount = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
  
    let unresolved = 0;
    let accepted = 0;
    let needsWork = 0;
  
    for (const f of report.findings) {
      const severity = f.snapshot?.severity;
      if (severity) severityCount[severity]++;
  
      if (f.statusAfterReview === 'accepted') accepted++;
      else if (f.statusAfterReview === 'needs_work') needsWork++;
  
      if (!f.resolvedAt) unresolved++;
    }
  
    return {
      totalChecklistItems: report.summary.totalChecklistItems,
      totalFindings: report.findings.length,
      criticalCount: severityCount.critical,
      highCount: severityCount.high,
      mediumCount: severityCount.medium,
      lowCount: severityCount.low,
      unresolvedFindings: unresolved,
      acceptedCount: accepted,
      needsWorkCount: needsWork
    };
  }
  
  /**
   * Append a change log entry to the report.
   */
  export function appendAuditChangeLog(
    report: StoredAuditReport,
    userId: string,
    userName: string,
    role: AuditUserRole,
    action: string
  ): void {
    const entry: AuditRoleActionLog = {
      userId,
      userName,
      role,
      action,
      timestamp: new Date().toISOString()
    };
  
    if (!report.changeLog) {
      report.changeLog = [];
    }
  
    report.changeLog.push(entry);
  }
  
  /**
   * Determine if a user with a given role can edit the audit report.
   */
  export function canEditAuditReport(role: AuditUserRole): boolean {
    return role === 'admin' || role === 'quality_manager';
  }
  
  /**
   * Determine if a user with a given role can review findings.
   */
  export function canReviewFindings(role: AuditUserRole): boolean {
    return role === 'admin' || role === 'quality_manager' || role === 'system_owner';
  }
  
  /**
   * Determine if a user with a given role can only view the report.
   */
  export function isReadOnlyViewer(role: AuditUserRole): boolean {
    return role === 'external_observer';
  }
  