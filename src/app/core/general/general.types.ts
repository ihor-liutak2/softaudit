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
  