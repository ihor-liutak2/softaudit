export type ReqSpecsItem = {
  id: string;                    // Unique identifier for the requirement/spec
  projectId: string;             // Associated ReqSpecsProject ID
  title: string;                 // Short title or summary of the requirement/spec
  description: string;           // Full technical or business description
  type: 'functional' | 'non-functional';  // Type of requirement
  priority: 'low' | 'medium' | 'high' | 'critical'; // Importance level
  status: 'proposed' | 'approved' | 'rejected' | 'implemented'; // Current lifecycle state

  createdAt: string;             // ISO timestamp when created
  updatedAt?: string;            // ISO timestamp when last updated
  createdBy: string;             // User ID or email who created this entry

  parentId?: string;             // Optional parent requirement ID (for hierarchy)
  linkedTo?: string[];           // Optional IDs of linked items (e.g., validations, features)
  notes?: string;                // Optional notes or rationale

  documentUrl?: string;          // Optional URL to a supporting document
  documentDescription?: string; // Optional description of the linked document
};




export type ReqSpecsProject = {
  id: string;                  // Unique project ID (Firestore document ID)
  companyId: string;           // Associated company ID

  title: string;               // Project title
  description?: string;        // Optional description of the project

  sector: string;              // Domain (e.g., Energy, Finance, Healthcare)
  startDate: string;           // ISO date string
  endDate?: string;            // Optional end date

  createdBy: string;

  stakeholders: {
    name: string;
    role: 'analyst' | 'architect' | 'developer' | 'qa_engineer' | 'product_owner' | 'admin';
    email?: string;
  }[];

  specs: ReqSpecsItem[];       // List of specification items

  status: 'draft' | 'in_progress' | 'approved' | 'archived';

  createdAt: string;           // ISO timestamp
  updatedAt?: string;          // ISO timestamp
};
