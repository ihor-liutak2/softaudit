import { AuditChecklistItem } from "../general/general.types";


export const AUDIT_CHECKLIST_DOCUMENTATION: AuditChecklistItem[] = [
    // General Documentation Requirements
    {
      id: 'doc-repository-availability',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Documentation',
      title: 'Documentation is stored in a single repository',
      description: 'Ensure all documentation is available in Confluence, SharePoint, Git or similar.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'doc-clear-structure-versioning',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Documentation',
      title: 'Documentation has clear structure and versioning',
      description: 'Verify that documents follow structured format and include version numbers.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'doc-template-format',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Documentation',
      title: 'Standard templates or formats are used',
      description: 'Check if all documents follow an approved template or format.',
      criticality: 'low',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'doc-authors-and-dates',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Documentation',
      title: 'Documents include authors, creation and update dates',
      description: 'Verify authorship and date of creation and updates are present in documents.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'doc-language-standards',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Documentation',
      title: 'Documentation meets language standards',
      description: 'Check grammar, terminology, and consistency of language.',
      criticality: 'low',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'doc-changelog-available',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Documentation',
      title: 'Change log is available',
      description: 'Verify the presence of changelog for document updates.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'doc-available-to-stakeholders',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Documentation',
      title: 'Documentation is accessible to all stakeholders',
      description: 'Ensure access for developers, testers, and customers.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
  
    // Technical Specification (Requirements)
    {
      id: 'req-exists-and-approved',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Technical Specification',
      title: 'Technical specification exists and is approved',
      description: 'Ensure the technical specification (TS) or requirements are approved by the customer.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'req-functional-requirements',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Technical Specification',
      title: 'Functional requirements are clearly defined',
      description: 'Verify that use cases or user stories are described in detail.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'req-nonfunctional-requirements',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Technical Specification',
      title: 'Non-functional requirements are defined',
      description: 'Check performance, security, scalability requirements are included.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'req-requirements-traceability',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Technical Specification',
      title: 'Requirements are numbered and traceable',
      description: 'Verify IDs exist and requirements are traceable (e.g. via Jira).',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'req-change-management',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Technical Specification',
      title: 'Requirements changes are documented and approved',
      description: 'Ensure changes to requirements are properly documented and approved.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
  
    // Planning
    {
      id: 'plan-exists-and-approved',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Planning',
      title: 'Project plan exists and is approved',
      description: 'Ensure project plan with schedule, stages, and milestones exists and is approved.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'plan-resources-allocated',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Planning',
      title: 'Project resources are allocated',
      description: 'Verify human and technical resources are planned.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'plan-risks-identified',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Planning',
      title: 'Risks are identified and mitigation planned',
      description: 'Check project plan for risk identification and mitigations.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    }
  ];

  
  export const AUDIT_CHECKLIST_CODE: AuditChecklistItem[] = [

    // 1. General Code Requirements
    {
      id: 'code-version-control',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Code is under version control',
      description: 'Ensure that the source code is stored in a version control system such as Git or SVN.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'code-commit-messages',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Clear commit messages are used',
      description: 'Verify that commit messages clearly describe the purpose of changes.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'code-modular-structure',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Code is modular and structured according to architecture',
      description: 'Check that the code follows a modular structure aligned with the project architecture.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'code-no-duplication',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'No code duplication (DRY principle)',
      description: 'Verify that code adheres to the DRY principle — Don’t Repeat Yourself.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'code-style-compliance',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Code style guidelines are followed',
      description: 'Ensure code adheres to project coding standards (e.g., PEP8, Google Java Style Guide).',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    },
  
    // 2. Readability and Documentation
    {
      id: 'code-meaningful-names',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Meaningful variable, function, and class names',
      description: 'Check that names are descriptive and correspond to their purposes.',
      criticality: 'low',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'code-comments-logic',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Code includes comments for complex logic',
      description: 'Ensure complex sections of code are properly commented.',
      criticality: 'low',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'api-documentation',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'API documentation is available',
      description: 'Verify API documentation exists (e.g., JavaDoc, PHPDoc).',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'comments-up-to-date',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Comments are current and accurate',
      description: 'Ensure comments are updated and do not contain outdated information.',
      criticality: 'low',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'consistent-formatting',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Consistent code formatting is used',
      description: 'Verify that linters or formatters are applied for consistent styling.',
      criticality: 'low',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
  
    // 3. Code Quality
    {
      id: 'single-responsibility-principle',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Code follows Single Responsibility Principle (SRP)',
      description: 'Ensure that functions and classes have single, clearly defined responsibilities.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'function-length-purpose',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Functions are short and focused',
      description: 'Check that methods are of limited size and serve a clear purpose.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'no-magic-numbers',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'No magic numbers or strings',
      description: 'Ensure constants are defined properly instead of hardcoding numbers or strings.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'modern-language-constructs',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Modern programming constructs are used',
      description: 'Avoid deprecated APIs and use updated language features.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'static-analysis-passed',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Source Code',
      title: 'Code passes static analysis',
      description: 'Verify code passes SonarQube, ESLint, Pylint or similar tools without critical errors.',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
  
  ];

  export const AUDIT_CHECKLIST_CODE_ERROR_MANAGEMENT: AuditChecklistItem[] = [

    {
      id: 'error-handling-exceptions',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Error Management',
      title: 'All exceptions are properly handled',
      description: 'Verify that all potential exceptions are caught and handled using appropriate mechanisms such as try-catch blocks.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'error-logging-context',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Error Management',
      title: 'Errors are logged with sufficient context',
      description: 'Check that errors are logged with stack traces and necessary parameters for debugging.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'error-user-messages',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Error Management',
      title: 'User-friendly error messages are provided',
      description: 'Ensure that error messages displayed to users are understandable and do not leak technical details.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'error-graceful-degradation',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Error Management',
      title: 'Code gracefully handles non-critical errors',
      description: 'Verify that the application continues to function when non-critical errors occur.',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    }
  
  ];

  export const AUDIT_CHECKLIST_CODE_SECURITY: AuditChecklistItem[] = [

    {
      id: 'security-no-vulnerabilities',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Security',
      title: 'Code does not contain known vulnerabilities',
      description: 'Ensure the code is free of common vulnerabilities like SQL Injection, XSS, CSRF and others.',
      criticality: 'high',
      standardCompliance: 'OWASP, ISO/IEC 27001',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'security-input-validation',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Security',
      title: 'All input data is validated and sanitized',
      description: 'Verify that user and external input is properly validated and sanitized before processing.',
      criticality: 'high',
      standardCompliance: 'OWASP, ISO/IEC 27001',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'security-no-sensitive-data-in-code',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Security',
      title: 'Sensitive data is not stored in source code',
      description: 'Ensure passwords, tokens, and other sensitive information are not hardcoded or stored in the repository.',
      criticality: 'high',
      standardCompliance: 'OWASP, ISO/IEC 27001',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'security-secure-data-transfer',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Security',
      title: 'Secure methods are used for data transmission',
      description: 'Verify that sensitive data is transmitted using secure protocols and encryption when required.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 27001',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'security-principle-of-least-privilege',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Security',
      title: 'Principle of least privilege is applied',
      description: 'Ensure that database and system access permissions are limited to only what is necessary.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 27001',
      defaultStatus: 'pending',
      active: true
    }
  
  ];

  export const AUDIT_CHECKLIST_CODE_TESTING: AuditChecklistItem[] = [

    {
      id: 'testing-unit-tests-exist',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Testing',
      title: 'Unit tests are implemented',
      description: 'Verify that unit tests are written for main components and core logic.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'testing-coverage-sufficient',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Testing',
      title: 'Test coverage meets project requirements',
      description: 'Ensure that the percentage of code covered by tests is acceptable (e.g. >= 80%).',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'testing-tests-are-independent',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Testing',
      title: 'Tests are independent and repeatable',
      description: 'Verify that tests can run in isolation and produce consistent results.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'testing-ci-passes',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Testing',
      title: 'Tests pass in continuous integration environment',
      description: 'Ensure that all automated tests pass successfully during CI/CD pipeline execution.',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'testing-integration-tests-exist',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Testing',
      title: 'Integration tests are documented and implemented',
      description: 'Verify that integration tests exist and cover component interactions.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    }
  
  ];

  export const AUDIT_CHECKLIST_CODE_REVIEW: AuditChecklistItem[] = [

    {
      id: 'review-process-exists',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Management',
      title: 'Code review process is defined and followed',
      description: 'Verify that all changes undergo code review using formal tools such as Pull Requests.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'review-records-exist',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Management',
      title: 'Review results are recorded',
      description: 'Check that review comments and approvals are recorded and traceable.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'review-comments-addressed',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Management',
      title: 'Issues identified during review are resolved',
      description: 'Ensure that all identified review comments are addressed before merging.',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'review-participants',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Management',
      title: 'Multiple reviewers participate',
      description: 'Verify that reviews are conducted by at least two developers or according to project standards.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    }
  
  ];

  export const AUDIT_CHECKLIST_CODE_OPTIMIZATION: AuditChecklistItem[] = [

    {
      id: 'optimization-no-performance-issues',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Optimization',
      title: 'No obvious performance issues in the code',
      description: 'Ensure that the code does not contain inefficient operations such as unnecessary loops or expensive database queries.',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'optimization-appropriate-data-structures',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Optimization',
      title: 'Appropriate data structures and algorithms are used',
      description: 'Verify that the code uses optimal data structures and algorithms suitable for the problem domain.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'optimization-caching-implemented',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Optimization',
      title: 'Caching is used for frequently accessed data',
      description: 'Check if caching mechanisms are implemented to optimize access to frequently used data when applicable.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'optimization-scalability',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Optimization',
      title: 'Code is designed to scale under expected load',
      description: 'Ensure that the codebase is capable of handling expected increases in load without major redesign.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    }
  
  ];

  export const AUDIT_CHECKLIST_CODE_COMPATIBILITY: AuditChecklistItem[] = [

    {
      id: 'compatibility-platforms',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Compatibility',
      title: 'Code is compatible with target platforms and environments',
      description: 'Ensure that the code works correctly across all target platforms (OS, browsers, hardware, etc.).',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'compatibility-dependencies-documented',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Compatibility',
      title: 'Dependencies are documented and up-to-date',
      description: 'Verify that all external libraries, frameworks, and tools are documented and regularly updated.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'compatibility-config-externalized',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Compatibility',
      title: 'Configuration parameters are externalized',
      description: 'Check that configuration values are stored outside the source code, such as in environment variables or config files.',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'compatibility-no-hardcoded-paths',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Compatibility',
      title: 'No hardcoded paths or URLs in the code',
      description: 'Ensure that the code does not contain hardcoded file paths, IP addresses, or URLs.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    }
  
  ];

  export const AUDIT_CHECKLIST_CODE_REQUIREMENTS: AuditChecklistItem[] = [

    {
      id: 'requirements-functional-implemented',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Requirements Compliance',
      title: 'Functional requirements are fully implemented',
      description: 'Verify that all functional requirements defined in the technical specifications or user stories are implemented in the code.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'requirements-nonfunctional-validated',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Requirements Compliance',
      title: 'Non-functional requirements are validated',
      description: 'Ensure that non-functional requirements such as performance, security, and scalability are properly addressed and validated.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'requirements-design-alignment',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Requirements Compliance',
      title: 'Code aligns with design specifications',
      description: 'Check that code implementation follows design documents and architectural guidelines.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'requirements-traceability',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Requirements Compliance',
      title: 'Requirements traceability is ensured',
      description: 'Verify that there is traceability between requirements and code (e.g., using IDs or links to user stories).',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 26514',
      defaultStatus: 'pending',
      active: true
    }
  
  ];

  export const AUDIT_CHECKLIST_DEVELOPMENT_ARTIFACTS: AuditChecklistItem[] = [

    {
      id: 'artifacts-ui-prototypes-exist',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Development Artifacts',
      title: 'UI/UX prototypes and mockups are available',
      description: 'Verify that user interface prototypes and design mockups are created, reviewed, and available for development reference.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'artifacts-database-schemas-documented',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Development Artifacts',
      title: 'Database schemas and structures are documented',
      description: 'Ensure that database schemas are created, versioned, and well-documented (e.g., ER diagrams).',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'artifacts-config-files-managed',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Development Artifacts',
      title: 'Configuration files are available and managed',
      description: 'Verify that configuration files are stored in version control and are properly structured for each environment.',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'artifacts-ci-scripts-available',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Development Artifacts',
      title: 'Automation scripts for CI/CD and testing are available',
      description: 'Check that automation scripts for build, deployment, and testing exist and are actively maintained.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    }
  
  ];
  
  export const AUDIT_CHECKLIST_PROJECT_MANAGEMENT: AuditChecklistItem[] = [

    {
      id: 'pms-code-repositories-used',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Management System',
      title: 'Code repositories are used and maintained',
      description: 'Verify that source code is stored in version control repositories (e.g., GitHub, GitLab, Bitbucket) and follows versioning practices.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'pms-task-tracking-system-in-use',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Management System',
      title: 'Task tracking system is used',
      description: 'Ensure that task management tools (e.g., Jira, Trello, Asana) are in use for managing issues, tasks, and planning work.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'pms-collaboration-tools-used',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Management System',
      title: 'Collaboration tools are used for communication',
      description: 'Verify that team communication and collaboration tools (e.g., Slack, Microsoft Teams) are used effectively.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    }
  
  ];
  
  
  export const AUDIT_CHECKLIST_INFRASTRUCTURE: AuditChecklistItem[] = [

    {
      id: 'infrastructure-environments-defined',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Infrastructure',
      title: 'Separate environments are defined and available',
      description: 'Verify that environments for development, testing, and production are properly defined and isolated.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 20000',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'infrastructure-cicd-configured',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Infrastructure',
      title: 'CI/CD pipeline is configured and operational',
      description: 'Ensure that Continuous Integration and Continuous Deployment pipelines are properly configured and functional.',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'infrastructure-security-controls',
      module: 'Audit',
      sector: 'general',
      section: 'object',
      subsection: 'Infrastructure',
      title: 'Data and access security controls are in place',
      description: 'Verify that infrastructure security mechanisms are implemented, including access controls and data protection measures.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 27001',
      defaultStatus: 'pending',
      active: true
    }
  
  ];

  export const AUDIT_CHECKLIST_PROJECT_PLANNING: AuditChecklistItem[] = [

    {
      id: 'planning-goals-scope-resources-defined',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Planning',
      title: 'Project goals, scope, and resources are defined',
      description: 'Verify that project objectives, scope of work, and necessary resources (human, technical, financial) are documented and approved.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 21500',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'planning-risk-management-defined',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Planning',
      title: 'Risk management plan is defined and maintained',
      description: 'Ensure that potential project risks are identified, assessed, and mitigation plans are developed and documented.',
      criticality: 'high',
      standardCompliance: 'ISO 31000',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'planning-schedule-tasks-assigned',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Project Planning',
      title: 'Project schedule and task assignment are documented',
      description: 'Verify that the project plan includes milestones, deadlines, and clearly assigned tasks to responsible team members.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    }
  
  ];
  
  export const AUDIT_CHECKLIST_REQUIREMENTS_MANAGEMENT: AuditChecklistItem[] = [

    {
      id: 'requirements-collection-analysis-documentation',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Requirements Management',
      title: 'Requirements are collected, analyzed, and documented',
      description: 'Ensure that all functional and non-functional requirements are gathered from stakeholders, analyzed for feasibility, and formally documented.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC/IEEE 29148',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'requirements-change-tracking',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Requirements Management',
      title: 'Requirements changes are tracked and controlled',
      description: 'Verify that a formal process is in place to manage changes to requirements, including traceability and approval.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC/IEEE 29148',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'requirements-product-compliance',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Requirements Management',
      title: 'Product compliance with requirements is verified',
      description: 'Ensure that the product is regularly reviewed and tested to confirm compliance with defined requirements.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    }
  
  ];

  export const AUDIT_CHECKLIST_DEVELOPMENT_PROCESS: AuditChecklistItem[] = [

    {
      id: 'development-code-writing-process-defined',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Development Process',
      title: 'Code writing process is defined and followed',
      description: 'Ensure that the process of writing, reviewing, and committing code is defined and consistently followed by all developers.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'development-coding-standards-applied',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Development Process',
      title: 'Coding standards are applied',
      description: 'Verify that coding standards and guidelines are defined and enforced through code reviews and static analysis tools.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'development-code-review-process',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Development Process',
      title: 'Code review process is established and followed',
      description: 'Ensure that all code changes are subject to peer review, with review results documented and corrective actions taken when necessary.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    }
  
  ];

  export const AUDIT_CHECKLIST_TESTING_PROCESS: AuditChecklistItem[] = [

    {
      id: 'testing-plan-and-execution',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Testing Process',
      title: 'Test planning and execution are performed',
      description: 'Ensure that unit, integration, system, and regression tests are planned, documented, and executed according to test strategy.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC/IEEE 29119',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'testing-automation-implemented',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Testing Process',
      title: 'Test automation is implemented where applicable',
      description: 'Verify that automated tests are created and maintained for repetitive and critical areas to ensure fast feedback and continuous quality.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC/IEEE 29119',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'testing-defect-management',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Testing Process',
      title: 'Defect management process is established',
      description: 'Ensure that all detected defects are logged, categorized, prioritized, tracked, and properly resolved.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC/IEEE 24765',
      defaultStatus: 'pending',
      active: true
    }
  
  ];

  export const AUDIT_CHECKLIST_CONFIGURATION_MANAGEMENT: AuditChecklistItem[] = [

    {
      id: 'config-version-control',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Configuration Management',
      title: 'Version control of code and artifacts is in place',
      description: 'Ensure that all source code and critical artifacts are versioned and stored in version control systems.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'config-release-management',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Configuration Management',
      title: 'Release management process is established',
      description: 'Verify that release procedures, including tagging, change logs, and approvals, are documented and followed.',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'config-environment-setup',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Configuration Management',
      title: 'Environment configuration is managed',
      description: 'Ensure that configuration of environments (dev, test, prod) is documented, versioned, and reproducible.',
      criticality: 'high',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    }
  
  ];
  
  
  export const AUDIT_CHECKLIST_QUALITY_MANAGEMENT: AuditChecklistItem[] = [

    {
      id: 'quality-standards-applied',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Quality Management',
      title: 'Quality standards are applied',
      description: 'Verify that the project applies recognized quality standards (e.g., ISO 9001, CMMI) in software development and delivery.',
      criticality: 'high',
      standardCompliance: 'ISO 9001 / CMMI',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'quality-internal-audits-conducted',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Quality Management',
      title: 'Internal audits are conducted regularly',
      description: 'Ensure that periodic internal audits are performed to assess compliance with processes and standards.',
      criticality: 'medium',
      standardCompliance: 'ISO 9001',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'quality-requirements-compliance-evaluated',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Quality Management',
      title: 'Compliance with requirements is evaluated',
      description: 'Verify that product and process compliance with customer and regulatory requirements is regularly assessed and documented.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 25010',
      defaultStatus: 'pending',
      active: true
    }
  
  ];


  export const AUDIT_CHECKLIST_RELEASE_AND_MAINTENANCE: AuditChecklistItem[] = [

    {
      id: 'release-product-process-defined',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Release and Maintenance',
      title: 'Product release process is defined and followed',
      description: 'Verify that the product release process is well-documented, including release preparation, approvals, and delivery to end users.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'release-monitoring-logging-configured',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Release and Maintenance',
      title: 'Monitoring and logging are configured',
      description: 'Ensure that appropriate monitoring and logging solutions are in place to track product performance and detect issues in production.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 27001',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'release-user-feedback-handling',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Release and Maintenance',
      title: 'User feedback is collected and processed',
      description: 'Verify that there is a defined process for collecting user feedback, analyzing it, and incorporating improvements into the product.',
      criticality: 'medium',
      standardCompliance: '',
      defaultStatus: 'pending',
      active: true
    }
  
  ];
  
  
  export const AUDIT_CHECKLIST_SECURITY: AuditChecklistItem[] = [

    {
      id: 'security-data-protection-check',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Security',
      title: 'Data protection mechanisms are in place',
      description: 'Verify that sensitive and personal data are protected during storage, processing, and transmission according to relevant regulations.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 27001, GDPR',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'security-vulnerability-testing-conducted',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Security',
      title: 'Vulnerability testing is performed',
      description: 'Ensure that regular vulnerability assessments and penetration tests are conducted and reported.',
      criticality: 'high',
      standardCompliance: 'OWASP, ISO/IEC 27001',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'security-standards-compliance-verified',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Security',
      title: 'Compliance with security standards is verified',
      description: 'Verify that the project adheres to security standards and best practices such as OWASP, GDPR, ISO/IEC 27001.',
      criticality: 'high',
      standardCompliance: 'OWASP, GDPR, ISO/IEC 27001',
      defaultStatus: 'pending',
      active: true
    }
  
  ];


  export const AUDIT_CHECKLIST_COMMUNICATION_AND_COLLABORATION: AuditChecklistItem[] = [

    {
      id: 'communication-meetings-organized',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Communication and Collaboration',
      title: 'Meetings are organized regularly',
      description: 'Verify that team meetings (such as stand-ups, retrospectives, and planning sessions) are held regularly to coordinate and align team efforts.',
      criticality: 'medium',
      standardCompliance: 'Agile Principles, ISO 21500',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'communication-knowledge-management',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Communication and Collaboration',
      title: 'Knowledge management practices are in place',
      description: 'Ensure that project knowledge, including documentation, guidelines, and lessons learned, is stored and maintained in an accessible knowledge base.',
      criticality: 'medium',
      standardCompliance: 'ISO/IEC 20000',
      defaultStatus: 'pending',
      active: true
    },
    {
      id: 'communication-stakeholder-interaction',
      module: 'Audit',
      sector: 'general',
      section: 'process',
      subsection: 'Communication and Collaboration',
      title: 'Stakeholder interaction is managed effectively',
      description: 'Verify that communication with stakeholders is organized, documented, and their feedback is considered in the project decision-making process.',
      criticality: 'high',
      standardCompliance: 'ISO/IEC 12207',
      defaultStatus: 'pending',
      active: true
    }
  
  ];
  
  

  
export const AUDIT_CHECKLIST = [...AUDIT_CHECKLIST_DOCUMENTATION, ...AUDIT_CHECKLIST_CODE, ...AUDIT_CHECKLIST_CODE_ERROR_MANAGEMENT,
    ...AUDIT_CHECKLIST_CODE_SECURITY, ...AUDIT_CHECKLIST_CODE_TESTING, ...AUDIT_CHECKLIST_CODE_REVIEW, ...AUDIT_CHECKLIST_CODE_OPTIMIZATION,
    ...AUDIT_CHECKLIST_CODE_COMPATIBILITY, ...AUDIT_CHECKLIST_CODE_REQUIREMENTS, ...AUDIT_CHECKLIST_DEVELOPMENT_ARTIFACTS, 
    ...AUDIT_CHECKLIST_PROJECT_MANAGEMENT, ...AUDIT_CHECKLIST_INFRASTRUCTURE, ...AUDIT_CHECKLIST_PROJECT_PLANNING, ...AUDIT_CHECKLIST_REQUIREMENTS_MANAGEMENT,
    ...AUDIT_CHECKLIST_DEVELOPMENT_PROCESS, ...AUDIT_CHECKLIST_TESTING_PROCESS, ...AUDIT_CHECKLIST_CONFIGURATION_MANAGEMENT, ...AUDIT_CHECKLIST_QUALITY_MANAGEMENT,
    ...AUDIT_CHECKLIST_RELEASE_AND_MAINTENANCE, ...AUDIT_CHECKLIST_SECURITY, ...AUDIT_CHECKLIST_COMMUNICATION_AND_COLLABORATION
];