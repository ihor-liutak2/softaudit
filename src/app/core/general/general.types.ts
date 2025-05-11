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
    id: string;                    // Unique identifier (Firestore document id)
    companyId: string;             // Company which is being audited
  
    title: string;                 // Project title
    description?: string;          // Optional project description (scope, goals)
  
    sector: string;                // Sector (Energy, Medical, Banking, etc.)
    startDate: string;             // When the audit started
    endDate?: string;              // When audit ended (optional)
  
    status: 'planned' | 'active' | 'completed' | 'archived'; // Project status
    active: boolean;               // Project is active or not (soft delete or archive flag)
  
    auditTeam: string[];           // User IDs or names of auditors
  
    checklistItems: AuditChecklistItem[];  // List of checklist item used for this audit
    findings: AuditFinding[];     // List of findings (optional)
  
    createdAt: string;             // When created
    updatedAt?: string;            // Last updated
  };
  
  
  export type Sector = {
    id: string;    // Unique sector identifier (lowercase, dash-separated)
    name: string;  // Human-readable sector name (Capitalized)
    description: string;
  };
  

  export type StoredReportFinding = {
    findingId: string;                     // Link to AuditFinding
    checklistItemId: string;              // Link to AuditChecklistItem
  
    reviewerComments?: string;
    correctionPlan?: string;
    statusAfterReview?: 'accepted' | 'needs_work' | 'rejected';
    resolvedBy?: string;
    resolvedAt?: string;
  
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
  
    findings: StoredReportFinding[];  // Findings with comments and review status
  
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
  
  