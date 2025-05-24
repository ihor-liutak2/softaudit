export type ValidationProject = {
    id: string;                     // Unique validation project ID
    companyId: string;              // Associated company ID

    title: string;                  // Name/title of the validation project
    description?: string;           // Optional general description

    specProjectId: string;          // Reference to the specification project (required)
    sector: string;                 // Business domain (e.g., Energy, Finance, Healthcare)
    relatedSystem?: string;         // Optional: name of the system being validated

    startDate: string;              // ISO date string for when validation begins
    endDate?: string;               // Optional end date for the project

    status: 'planned' | 'in_progress' | 'completed' | 'archived';  // Project status

    validationLeads: {
        email: string;
        role: 'qa_engineer' | 'validation_lead' | 'developer' | 'product_owner';
    }[];

    createdBy: string;             // Creator’s email or ID
    createdAt: string;             // ISO timestamp of creation
    updatedAt?: string;            // Optional: last update timestamp

    notes?: string;                // Optional notes or metadata
};


export type ValidationItem = {
    id: string;                     // Unique identifier for the validation item
    projectId: string;              // Associated project ID
    requirementId?: string;         // Optional related requirement ID

    title: string;                  // Short title for the validation
    description?: string;           // Optional detailed description

    type: 'unit' | 'integration' | 'system' | 'user_acceptance' | 'regression'; // Type of validation
    method: 'manual' | 'automated'; // Validation method used
    tool?: string;                  // Tool used if automated (e.g., Cypress, JUnit)

    status: 'pending' | 'passed' | 'failed' | 'skipped' | 'blocked'; // Current status
    severity?: 'low' | 'medium' | 'high' | 'critical'; // Severity if failed

    expectedResult?: string;       // What should happen
    actualResult?: string;         // What actually happened

    externalDocs?: {
        url: string;                 // Link to the external document (e.g., PDF, Google Doc)
        description?: string;        // Short description of what the document contains
    }[];

    createdBy: string;             // Email or user ID of the creator
    createdAt: string;             // ISO timestamp of creation
    updatedAt?: string;            // ISO timestamp of last update

    notes?: string;                // Additional remarks or context
};
