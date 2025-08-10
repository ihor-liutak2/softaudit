// --- Shared primitives -------------------------------------------------------

export type Id = string;
export type ISODate = string; // ISO string, e.g., new Date().toISOString()

export type RequirementType = 'functional' | 'nonfunctional' | 'constraint' | 'glossary';
export type Priority = 'must' | 'should' | 'could' | 'wont';
export type Status = 'draft' | 'in-review' | 'approved' | 'deprecated';

export interface UserRef {
  uid: Id;
  email?: string;
  displayName?: string;
}

export interface StandardRef {
  /** Standard code, e.g., "ISO/IEC/IEEE 29148:2018" */
  code: string;
  /** Optional specific clause reference, e.g., "5.2.3" */
  clause?: string;
  /** Optional note for context */
  note?: string;
}

// --- Project (SRS header) ----------------------------------------------------

export interface ReqSpecsProject {
  id: Id;
  name: string;

  companyId?: Id;
  sectorId?: Id;
  description?: string;

  stakeholders?: Array<{ name: string; role?: string; contact?: string }>;
  standards?: StandardRef[];         // Project-level standards
  tags?: string[];                   // For filtering/search

  status: Status;                    // draft/in-review/approved/...
  deadlineAt?: ISODate;

  createdBy: UserRef;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// --- Requirement item --------------------------------------------------------

export interface ReqSpecsItem {
  id: Id;
  projectId: Id;

  type: RequirementType;             // functional/nonfunctional/constraint/...
  title: string;
  description: string;

  acceptanceCriteria?: string[];     // For testability/verifiability
  rationale?: string;                // Why this requirement exists
  source?: string;                   // Origin (SOW, interview, etc.)

  priority: Priority;                // MoSCoW
  status: Status;                    // draft/in-review/approved/...

  parentId?: Id;                     // Hierarchy (epic → feature → sub)
  order?: number;                    // Stable ordering inside a level

  standards?: StandardRef[];         // Exact clauses this item maps to
  links?: Array<{ title: string; url: string }>;
  related?: Id[];                    // Cross-links to other requirements

  createdBy: UserRef;
  createdAt: ISODate;
  updatedAt: ISODate;

  tags?: string[];
}

// --- Checklist (template & result) ------------------------------------------

export interface ChecklistTemplate {
  id: Id;
  name: string;                      // e.g., "SMART for SRS", "IEEE 29148 core"
  items: Array<{
    id: Id;
    text: string;                    // "The requirement is unambiguous..."
    standard?: StandardRef;
    required?: boolean;
  }>;
  createdBy: UserRef;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface ChecklistResult {
  id: Id;
  projectId: Id;
  templateId: Id;
  answers: Array<{
    itemId: Id;
    done: boolean;
    comment?: string;
  }>;
  score?: number;                    // e.g., percentage of "done"
  createdBy: UserRef;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// --- Standards catalog (optional) -------------------------------------------

export interface StandardDoc {
  id: Id;                            // e.g., "ISO-25010-2011"
  code: string;                      // "ISO/IEC 25010:2011"
  title: string;
  year?: number;
  summary?: string;
  tags?: string[];
  links?: string[];                  // Official links
}

// --- Bridge to Audit module --------------------------------------------------

export interface AuditBridge {
  id: Id;
  reqSpecsProjectId: Id;             // What SRS project will be audited
  createdBy: UserRef;
  createdAt: ISODate;
  status: 'new' | 'in-progress' | 'closed';
}
