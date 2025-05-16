export type Company = {
  id: string;               // Unique identifier (Firestore document id)
  name: string;             // Company name
  description?: string;     // Short description (optional)
  sector: string;           // Sector (Energy, Medical, Banking, Military, etc.)
  address?: string;         // Location / region (optional)
  employeesCount?: number;  // Number of employees (optional)
  registeredAt: string;     // Registration date or when added to system
  projectsCount?: number;   // Number of audit/validation projects (optional)
  active: boolean;          // Is company active
};


export type AuditChecklistItem = {
  id: string;              // Unique identifier
  module: string;          // Module this item belongs to (Audit, Validation, Verification, Security etc.)
  sector: string;          // Sector (Energy, Medical, Banking, Military, etc.)
  section: 'object' | 'process'; // What is checked - Object or Process
  subsection: string;      // Subsection depending on section
  title: string;           // Short name of the check
  description: string;     // Detailed description (what and how to check)
  criticality: 'low' | 'medium' | 'high';   // How critical the check is
  standardCompliance?: string; // What standard or requirement does it cover (optional)
  defaultStatus: 'pending' | 'pass' | 'fail' | 'n/a';  // Default status
  active: boolean;         // Is active (can be used)
};

export type AuditFindingTemplate = {
  id: string;                  // Unique identifier
  checklistItemId: string;     // The checklist item (AuditChecklistItem) this finding refers to

  title: string;               // Short title or summary of finding
  description: string;         // Detailed description of the issue

  severity: 'low' | 'medium' | 'high' | 'critical';  // Severity level of the finding
};



export type AuditFinding = {
  id: string;                  // Unique identifier
  projectId: string;           // The audit project where this finding was recorded
  checklistItemId: string;     // The checklist item (AuditChecklistItem) this finding refers to

  title: string;               // Short title or summary of finding
  description: string;         // Detailed description of the issue

  severity: 'low' | 'medium' | 'high' | 'critical';  // Severity level of the finding
  status: 'open' | 'in_progress' | 'resolved' | 'closed';  // Current status

  detectedAt: string;          // Date and time when finding was detected
  resolvedAt?: string;         // Date when resolved (optional)

  notes?: string;              // Additional notes (optional)
};


export type AuditProject = {
  id: string;
  companyId: string;

  title: string;
  description?: string;
  sector: string;
  startDate: string;
  endDate?: string;

  status: 'planned' | 'active' | 'completed' | 'archived';
  active: boolean;

  auditTeam: string[]; // Auditors (users with internal roles)

  // Optional fields for role-based collaboration and approval process
  companyRepresentatives?: {
    name: string;
    role: 'quality_manager' | 'system_owner' | 'compliance_officer' | 'external_observer';
    email?: string;
  }[];

  approvers?: {
    userId: string;
    name: string;
    email?: string;
    approvedAt?: string;
  }[];

  checklistItems: AuditChecklistItem[];
  createdAt: string;
  updatedAt?: string;
};


export type Sector = {
  id: string;    // Unique sector identifier (lowercase, dash-separated)
  name: string;  // Human-readable sector name (Capitalized)
  description: string;
};


// Expanded roles with change tracking for audit operations
export type AuditUserRole =
  | 'auditor'
  | 'quality_manager' // includes compliance responsibilities
  | 'system_owner'
  | 'external_observer'
  | 'admin';

export type AuditRoleActionLog = {
  role: AuditUserRole;
  userId: string;
  userName?: string;
  action: string;
  timestamp: string;
};

export type StoredAuditReportFinding = {
  findingId: string;                     // Link to AuditFinding
  checklistItemId: string;              // Link to AuditChecklistItem

  reviewerComments?: string;
  correctionPlan?: string;
  statusAfterReview?: 'accepted' | 'needs_work' | 'rejected';
  resolvedBy?: string;
  resolvedAt?: string;

  lastModifiedBy?: {
    userId: string;
    userName?: string;
    role: AuditUserRole;
    modifiedAt: string;
  };

  // Optional snapshot of data at time of report
  snapshot?: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    detectedAt: string;
  };
};

export type StoredAuditReport = {
  id: string;                        // Firestore document ID
  projectId: string;                 // Link to AuditProject
  createdBy: string;                // User ID of creator
  createdAt: string;                // Timestamp
  updatedAt?: string;               // Last update (optional)
  status: 'draft' | 'submitted' | 'approved'; // Workflow state

  findings: StoredAuditReportFinding[];  // Findings with comments and review status

  changeLog?: AuditRoleActionLog[];      // History of who did what in report-level

  summary: {
    totalChecklistItems: number;
    totalFindings: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    unresolvedFindings: number;
    acceptedCount: number;
    needsWorkCount: number;
  };
};


