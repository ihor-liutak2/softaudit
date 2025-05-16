import {
  AuditFinding,
  AuditProject,
  StoredAuditReport,
  StoredAuditReportFinding,
  AuditRoleActionLog,
  AuditUserRole
} from "../core/general/general.types";

export function buildEmptyAuditReport(
  project: AuditProject,
  findings: AuditFinding[],
  currentUserEmail: string,
  currentUserId: string = 'system',
  currentUserRole: AuditUserRole = 'quality_manager'
): StoredAuditReport {
  const now = new Date().toISOString();

  const enrichedFindings: StoredAuditReportFinding[] = findings.map(f => ({
    findingId: f.id,
    checklistItemId: f.checklistItemId,
    reviewerComments: '',
    correctionPlan: '',
    statusAfterReview: undefined,
    resolvedBy: undefined,
    resolvedAt: undefined,
    lastModifiedBy: {
      userId: currentUserId,
      userName: currentUserEmail,
      role: currentUserRole,
      modifiedAt: now
    },
    snapshot: {
      title: f.title,
      description: f.description,
      severity: f.severity,
      detectedAt: f.detectedAt
    }
  }));

  const severityCount = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  let unresolved = 0;
  let accepted = 0;
  let needsWork = 0;

  for (const f of enrichedFindings) {
    severityCount[f.snapshot!.severity]++;
    if (f.statusAfterReview === 'accepted') accepted++;
    else if (f.statusAfterReview === 'needs_work') needsWork++;
    if (!f.resolvedAt) unresolved++;
  }

  const report: StoredAuditReport = {
    id: project.id,
    projectId: project.id,
    createdBy: currentUserId,
    createdAt: now,
    status: 'draft',
    findings: enrichedFindings,
    changeLog: [
      {
        role: currentUserRole,
        userId: currentUserId,
        userName: currentUserEmail,
        action: 'initial_report_created',
        timestamp: now
      }
    ],
    summary: {
      totalChecklistItems: project.checklistItems.length,
      totalFindings: findings.length,
      criticalCount: severityCount.critical,
      highCount: severityCount.high,
      mediumCount: severityCount.medium,
      lowCount: severityCount.low,
      unresolvedFindings: unresolved,
      acceptedCount: accepted,
      needsWorkCount: needsWork
    }
  };

  return report;
}
