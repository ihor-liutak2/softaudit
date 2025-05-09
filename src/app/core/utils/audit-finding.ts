import { AuditFindingTemplate } from "../general/general.types";


export const AUDIT_FINDING_TEMPLATES: AuditFindingTemplate[] = [
  {
    id: 'f1',
    checklistItemId: 'doc-repository-availability',
    title: 'Missing centralized repository',
    description: 'Documentation is scattered across multiple locations with no unified access point.',
    severity: 'medium'
  },
  {
    id: 'f2',
    checklistItemId: 'doc-repository-availability',
    title: 'Limited access to repository',
    description: 'Some team members lack access rights to view or edit documentation.',
    severity: 'low'
  },
  {
    id: 'f3',
    checklistItemId: 'doc-repository-availability',
    title: 'Repository not maintained',
    description: 'Central repository exists but is outdated or inconsistently used.',
    severity: 'medium'
  },
  {
    id: 'f4',
    checklistItemId: 'doc-clear-structure-versioning',
    title: 'No version control in documents',
    description: 'Documents do not indicate versions or modification dates.',
    severity: 'medium'
  },
  {
    id: 'f5',
    checklistItemId: 'doc-clear-structure-versioning',
    title: 'Inconsistent document structure',
    description: 'Documents follow no unified layout or section structure.',
    severity: 'low'
  },
  {
    id: 'f6',
    checklistItemId: 'doc-clear-structure-versioning',
    title: 'Versioning process not documented',
    description: 'There is no defined process for maintaining version history.',
    severity: 'medium'
  },
  {
    id: 'f7',
    checklistItemId: 'doc-template-format',
    title: 'Templates not used',
    description: 'Documents are created ad-hoc without using standard templates.',
    severity: 'low'
  },
  {
    id: 'f8',
    checklistItemId: 'doc-template-format',
    title: 'Outdated template usage',
    description: 'Team uses old document templates that do not meet current standards.',
    severity: 'low'
  },
  {
    id: 'f9',
    checklistItemId: 'doc-template-format',
    title: 'Non-compliant document formats',
    description: 'Some documents are submitted in formats that are not supported or approved.',
    severity: 'medium'
  },
  {
    id: 'f10',
    checklistItemId: 'doc-authors-and-dates',
    title: 'Missing authorship information',
    description: 'Documents do not include author names or contact details.',
    severity: 'low'
  },
  {
    id: 'f11',
    checklistItemId: 'doc-authors-and-dates',
    title: 'Missing timestamps',
    description: 'No creation or last updated dates are included in the documents.',
    severity: 'low'
  },
  {
    id: 'f12',
    checklistItemId: 'doc-authors-and-dates',
    title: 'Incorrect author attribution',
    description: 'Documents list wrong or outdated author names.',
    severity: 'low'
  },
  {
    id: 'f13',
    checklistItemId: 'doc-language-standards',
    title: 'Poor grammar and spelling',
    description: 'Multiple grammatical and spelling errors were identified.',
    severity: 'low'
  },
  {
    id: 'f14',
    checklistItemId: 'doc-language-standards',
    title: 'Inconsistent terminology',
    description: 'Key terms are used inconsistently across documentation.',
    severity: 'low'
  },
  {
    id: 'f15',
    checklistItemId: 'doc-language-standards',
    title: 'Non-standard language usage',
    description: 'Documentation does not adhere to defined language style guide.',
    severity: 'medium'
  },
  {
    id: 'f16',
    checklistItemId: 'doc-changelog-available',
    title: 'Missing changelog',
    description: 'No changelog provided for document revisions.',
    severity: 'medium'
  },
  {
    id: 'f17',
    checklistItemId: 'doc-changelog-available',
    title: 'Changelog not updated',
    description: 'Changelog exists but is not consistently maintained.',
    severity: 'low'
  },
  {
    id: 'f18',
    checklistItemId: 'doc-changelog-available',
    title: 'Changelog lacks detail',
    description: 'Changelog entries are too vague to understand changes made.',
    severity: 'low'
  },
  {
    id: 'f19',
    checklistItemId: 'doc-available-to-stakeholders',
    title: 'Limited stakeholder access',
    description: 'Not all stakeholders have access to relevant documentation.',
    severity: 'high'
  },
  {
    id: 'f20',
    checklistItemId: 'doc-available-to-stakeholders',
    title: 'Access control not defined',
    description: 'There is no policy defining who can access which documents.',
    severity: 'medium'
  },
  {
    id: 'f21',
    checklistItemId: 'doc-available-to-stakeholders',
    title: 'Access monitoring absent',
    description: 'No audit or logging is enabled for document access.',
    severity: 'high'
  },
  {
    id: 'f22',
    checklistItemId: 'req-exists-and-approved',
    title: 'Approval for technical specification is missing',
    description: 'Although a technical specification exists, it lacks formal approval or sign-off from key stakeholders.',
    severity: 'high'
  },
  {
    id: 'f23',
    checklistItemId: 'req-functional-requirements',
    title: 'Ambiguity in functional requirements',
    description: 'Some use cases contain ambiguous wording or missing acceptance criteria.',
    severity: 'medium'
  },
  {
    id: 'f24',
    checklistItemId: 'req-nonfunctional-requirements',
    title: 'Non-functional requirements are outdated',
    description: 'The documented performance or security requirements do not reflect the current system constraints.',
    severity: 'medium'
  },
  {
    id: 'f25',
    checklistItemId: 'req-requirements-traceability',
    title: 'Traceability matrix is incomplete',
    description: 'Not all requirements are mapped to corresponding test cases or development tasks.',
    severity: 'medium'
  },
  {
    id: 'f26',
    checklistItemId: 'req-change-management',
    title: 'Uncontrolled changes to requirements',
    description: 'Changes to requirements have been made without going through a formal change control process.',
    severity: 'medium'
  },
  {
    id: 'f27',
    checklistItemId: 'plan-exists-and-approved',
    title: 'Missing approval for project plan',
    description: 'The project plan has not been formally reviewed or approved by stakeholders.',
    severity: 'high'
  },
  {
    id: 'f28',
    checklistItemId: 'plan-exists-and-approved',
    title: 'Incomplete project milestones',
    description: 'The project plan lacks clear milestones or deliverable deadlines.',
    severity: 'medium'
  },
  {
    id: 'f29',
    checklistItemId: 'plan-resources-allocated',
    title: 'Unclear resource allocation',
    description: 'The plan does not specify which team members or technical tools are responsible for key tasks.',
    severity: 'medium'
  },
  {
    id: 'f30',
    checklistItemId: 'plan-risks-identified',
    title: 'Risk analysis not documented',
    description: 'There is no documented risk assessment or mitigation strategy in the planning documents.',
    severity: 'medium'
  },
  {
    id: 'f31',
    checklistItemId: 'code-version-control',
    title: 'Missing version control system',
    description: 'The project codebase is not managed in a version control system like Git or SVN.',
    severity: 'high'
  },
  {
    id: 'f32',
    checklistItemId: 'code-version-control',
    title: 'Inconsistent use of version control',
    description: 'Some code components are outside the main repository and not tracked properly.',
    severity: 'medium'
  },
  {
    id: 'f33',
    checklistItemId: 'code-commit-messages',
    title: 'Vague or unclear commit messages',
    description: 'Commit history contains generic or meaningless messages that do not describe the changes made.',
    severity: 'medium'
  },
  {
    id: 'f34',
    checklistItemId: 'code-modular-structure',
    title: 'Monolithic code blocks',
    description: 'The code is tightly coupled and does not follow a modular design as per the defined architecture.',
    severity: 'medium'
  },
  {
    id: 'f35',
    checklistItemId: 'code-no-duplication',
    title: 'Duplicated logic found in codebase',
    description: 'There are repeated code blocks violating the DRY principle, increasing maintenance risk.',
    severity: 'medium'
  },
  {
    id: 'f36',
    checklistItemId: 'code-style-compliance',
    title: 'Code style violations detected',
    description: 'Code does not conform to the team’s established formatting or naming conventions.',
    severity: 'medium'
  },
  {
    id: 'f37',
    checklistItemId: 'code-meaningful-names',
    title: 'Non-descriptive or cryptic names used',
    description: 'Variables, functions, or class names are too short or do not clearly describe their role.',
    severity: 'low'
  },
  {
    id: 'f38',
    checklistItemId: 'code-comments-logic',
    title: 'Complex logic lacks explanation',
    description: 'Critical or non-obvious parts of the code are not commented, reducing maintainability.',
    severity: 'low'
  },
  {
    id: 'f39',
    checklistItemId: 'api-documentation',
    title: 'API lacks documentation',
    description: 'Public interfaces or endpoints are missing descriptions or parameter details.',
    severity: 'medium'
  },
  {
    id: 'f40',
    checklistItemId: 'comments-up-to-date',
    title: 'Outdated or misleading comments',
    description: 'Comments do not match current code behavior, leading to confusion during maintenance.',
    severity: 'low'
  },
  {
    id: 'f41',
    checklistItemId: 'consistent-formatting',
    title: 'Inconsistent code formatting',
    description: 'Indentation, spacing, or brace styles vary across files due to lack of linting or formatting.',
    severity: 'low'
  },
  {
    id: 'f42',
    checklistItemId: 'single-responsibility-principle',
    title: 'Multiple responsibilities in a single class or function',
    description: 'A function or class performs more than one logical task, violating SRP.',
    severity: 'medium'
  },
  {
    id: 'f43',
    checklistItemId: 'function-length-purpose',
    title: 'Overly long or unfocused functions',
    description: 'Functions exceed recommended length or perform unrelated tasks.',
    severity: 'medium'
  },
  {
    id: 'f44',
    checklistItemId: 'no-magic-numbers',
    title: 'Magic numbers or strings found in code',
    description: 'Literal values are used without context or constants, reducing readability.',
    severity: 'medium'
  },
  {
    id: 'f45',
    checklistItemId: 'modern-language-constructs',
    title: 'Deprecated or outdated syntax used',
    description: 'Code contains old constructs or APIs that are no longer recommended.',
    severity: 'medium'
  },
  {
    id: 'f46',
    checklistItemId: 'static-analysis-passed',
    title: 'Static analysis reports critical issues',
    description: 'Static code analysis tools identified serious problems in the codebase.',
    severity: 'high'
  },
  {
    id: 'f47',
    checklistItemId: 'error-handling-exceptions',
    title: 'Uncaught exceptions found in the code',
    description: 'Certain operations lack try-catch blocks, leading to unhandled exceptions.',
    severity: 'high'
  },
  {
    id: 'f48',
    checklistItemId: 'error-logging-context',
    title: 'Insufficient logging context for errors',
    description: 'Error logs do not include stack traces or relevant request data for debugging.',
    severity: 'medium'
  },
  {
    id: 'f49',
    checklistItemId: 'error-user-messages',
    title: 'Technical error messages shown to users',
    description: 'Errors expose internal system details instead of user-friendly messages.',
    severity: 'medium'
  },
  {
    id: 'f50',
    checklistItemId: 'error-graceful-degradation',
    title: 'Non-critical errors disrupt application flow',
    description: 'Application fails to continue operating when recoverable errors occur.',
    severity: 'high'
  },
  {
    id: 'f56',
    checklistItemId: 'security-no-vulnerabilities',
    title: 'Potential XSS vulnerability found',
    description: 'The application does not encode output properly in several places, exposing it to Cross-Site Scripting.',
    severity: 'high'
  },
  {
    id: 'f57',
    checklistItemId: 'security-no-vulnerabilities',
    title: 'SQL Injection possibility',
    description: 'User input is directly concatenated into SQL query without parameter binding.',
    severity: 'high'
  },
  {
    id: 'f58',
    checklistItemId: 'security-no-vulnerabilities',
    title: 'CSRF tokens missing in sensitive operations',
    description: 'Critical operations such as payments or profile changes do not include CSRF protection.',
    severity: 'medium'
  },
  
  {
    id: 'f59',
    checklistItemId: 'security-input-validation',
    title: 'Missing validation for numeric fields',
    description: 'Input fields for amounts or IDs do not validate expected formats or ranges.',
    severity: 'medium'
  },
  {
    id: 'f60',
    checklistItemId: 'security-input-validation',
    title: 'Lack of input sanitization',
    description: 'User input is used in rendering HTML without sanitization.',
    severity: 'high'
  },
  {
    id: 'f61',
    checklistItemId: 'security-input-validation',
    title: 'Unvalidated parameters in API',
    description: 'Several API endpoints accept query parameters without validation or filtering.',
    severity: 'medium'
  },
  
  {
    id: 'f62',
    checklistItemId: 'security-no-sensitive-data-in-code',
    title: 'Hardcoded API key in frontend',
    description: 'Public repository contains hardcoded API keys visible in the browser.',
    severity: 'high'
  },
  {
    id: 'f63',
    checklistItemId: 'security-no-sensitive-data-in-code',
    title: 'Credentials stored in source code',
    description: 'Database user credentials are found in configuration files committed to version control.',
    severity: 'high'
  },
  
  {
    id: 'f64',
    checklistItemId: 'security-secure-data-transfer',
    title: 'Unencrypted HTTP used for authentication',
    description: 'Login form submits credentials over HTTP instead of HTTPS.',
    severity: 'high'
  },
  {
    id: 'f65',
    checklistItemId: 'security-secure-data-transfer',
    title: 'Sensitive information exposed in URL',
    description: 'Session tokens and personal data appear in URL parameters.',
    severity: 'medium'
  },
  {
    id: 'f66',
    checklistItemId: 'security-secure-data-transfer',
    title: 'Lack of TLS enforcement',
    description: 'Backend services communicate over unsecured protocols.',
    severity: 'high'
  },
  
  {
    id: 'f67',
    checklistItemId: 'security-principle-of-least-privilege',
    title: 'Database user has full access',
    description: 'The application uses a database user account with all privileges, including DROP and GRANT.',
    severity: 'medium'
  },
  {
    id: 'f68',
    checklistItemId: 'security-principle-of-least-privilege',
    title: 'Excessive permissions for logs viewer',
    description: 'Log viewer role is allowed to modify or delete logs.',
    severity: 'low'
  },
  {
    id: 'f69',
    checklistItemId: 'testing-unit-tests-exist',
    title: 'Missing unit tests for business logic',
    description: 'Core modules such as authentication and payment processing lack any unit tests.',
    severity: 'high'
  },
  {
    id: 'f70',
    checklistItemId: 'testing-unit-tests-exist',
    title: 'Legacy modules not covered by unit tests',
    description: 'Older modules are missing unit tests, leading to regression risks.',
    severity: 'medium'
  },
  {
    id: 'f71',
    checklistItemId: 'testing-unit-tests-exist',
    title: 'Unit test coverage missing for edge cases',
    description: 'Unit tests exist but fail to cover boundary and error conditions.',
    severity: 'medium'
  },
  
  {
    id: 'f72',
    checklistItemId: 'testing-coverage-sufficient',
    title: 'Test coverage below required threshold',
    description: 'Overall code coverage is 52%, which is below the required 80% mark.',
    severity: 'medium'
  },
  {
    id: 'f73',
    checklistItemId: 'testing-coverage-sufficient',
    title: 'Critical modules lack sufficient test coverage',
    description: 'Modules with financial logic are under-tested, increasing risk of undetected bugs.',
    severity: 'high'
  },
  {
    id: 'f74',
    checklistItemId: 'testing-coverage-sufficient',
    title: 'UI components not covered by tests',
    description: 'UI components are excluded from the current coverage metrics.',
    severity: 'low'
  },
  
  {
    id: 'f75',
    checklistItemId: 'testing-tests-are-independent',
    title: 'Tests fail when run in different order',
    description: 'Test results vary based on execution order, indicating interdependencies.',
    severity: 'medium'
  },
  {
    id: 'f76',
    checklistItemId: 'testing-tests-are-independent',
    title: 'Database state shared across test cases',
    description: 'Several tests rely on shared database state, causing flaky test results.',
    severity: 'medium'
  },
  {
    id: 'f77',
    checklistItemId: 'testing-tests-are-independent',
    title: 'Tests require manual cleanup',
    description: 'Tests leave residual data that must be cleaned manually between runs.',
    severity: 'low'
  },
  
  {
    id: 'f78',
    checklistItemId: 'testing-ci-passes',
    title: 'CI pipeline fails due to unstable tests',
    description: 'CI/CD runs frequently fail due to inconsistent test results.',
    severity: 'high'
  },
  {
    id: 'f79',
    checklistItemId: 'testing-ci-passes',
    title: 'Tests disabled in CI configuration',
    description: 'Several tests are skipped or excluded in the CI configuration.',
    severity: 'medium'
  },
  {
    id: 'f80',
    checklistItemId: 'testing-ci-passes',
    title: 'CI logs do not provide failure details',
    description: 'Test failures during CI execution lack sufficient log detail for diagnosis.',
    severity: 'low'
  },
  
  {
    id: 'f81',
    checklistItemId: 'testing-integration-tests-exist',
    title: 'Integration tests missing for external APIs',
    description: 'No integration tests exist for payment gateway and email service.',
    severity: 'high'
  },
  {
    id: 'f82',
    checklistItemId: 'testing-integration-tests-exist',
    title: 'No tests for service-to-service communication',
    description: 'Microservice interactions are not tested end-to-end.',
    severity: 'medium'
  },
  {
    id: 'f83',
    checklistItemId: 'testing-integration-tests-exist',
    title: 'Test cases undocumented',
    description: 'Integration tests exist but are not documented or explained.',
    severity: 'low'
  },
  {
    id: 'f84',
    checklistItemId: 'review-process-exists',
    title: 'Code changes are not reviewed',
    description: 'Several commits are merged directly to main without undergoing formal review.',
    severity: 'high'
  },
  {
    id: 'f85',
    checklistItemId: 'review-process-exists',
    title: 'Code review policy not enforced',
    description: 'Although defined, code reviews are bypassed due to lack of enforcement in CI/CD.',
    severity: 'medium'
  },
  {
    id: 'f86',
    checklistItemId: 'review-process-exists',
    title: 'Review process not documented',
    description: 'Team lacks clear documentation on how and when reviews should happen.',
    severity: 'low'
  },
  
  {
    id: 'f87',
    checklistItemId: 'review-records-exist',
    title: 'Review comments are not stored',
    description: 'Pull request comments are deleted or unavailable for audit trail.',
    severity: 'medium'
  },
  {
    id: 'f88',
    checklistItemId: 'review-records-exist',
    title: 'No record of code review approvals',
    description: 'Merge history lacks approvals or records of review decisions.',
    severity: 'medium'
  },
  {
    id: 'f89',
    checklistItemId: 'review-records-exist',
    title: 'Review notes are scattered across tools',
    description: 'Comments are distributed across GitHub, Slack, and email with no central traceability.',
    severity: 'low'
  },
  
  {
    id: 'f90',
    checklistItemId: 'review-comments-addressed',
    title: 'Review feedback is ignored',
    description: 'Code is merged despite unresolved critical comments in the review.',
    severity: 'high'
  },
  {
    id: 'f91',
    checklistItemId: 'review-comments-addressed',
    title: 'Changes committed without comment resolution',
    description: 'Follow-up commits fail to address previously raised concerns.',
    severity: 'medium'
  },
  {
    id: 'f92',
    checklistItemId: 'review-comments-addressed',
    title: 'No confirmation of comment resolution',
    description: 'Reviewers mark threads as resolved without explanation or commit references.',
    severity: 'low'
  },
  
  {
    id: 'f93',
    checklistItemId: 'review-participants',
    title: 'Single developer performs all reviews',
    description: 'Code reviews are done by the same person, lacking diversity of perspective.',
    severity: 'medium'
  },
  {
    id: 'f94',
    checklistItemId: 'review-participants',
    title: 'No cross-functional review',
    description: 'Security and QA teams are excluded from review processes involving their domains.',
    severity: 'medium'
  },
  {
    id: 'f95',
    checklistItemId: 'review-participants',
    title: 'Peer review policy undefined',
    description: 'Project lacks policy for minimum number of reviewers or qualifications.',
    severity: 'low'
  },
  {
    id: 'f96',
    checklistItemId: 'optimization-no-performance-issues',
    title: 'Code contains redundant database queries',
    description: 'Several API endpoints perform unnecessary joins or unindexed queries, degrading performance.',
    severity: 'high'
  },
  {
    id: 'f97',
    checklistItemId: 'optimization-no-performance-issues',
    title: 'Inefficient loops and logic blocks found',
    description: 'Loops with nested logic or unnecessary recalculations identified in core processing functions.',
    severity: 'high'
  },
  {
    id: 'f98',
    checklistItemId: 'optimization-no-performance-issues',
    title: 'Heavy computation on frontend',
    description: 'Complex sorting and filtering operations are performed on the client, impacting UI responsiveness.',
    severity: 'medium'
  },
  
  {
    id: 'f99',
    checklistItemId: 'optimization-appropriate-data-structures',
    title: 'Incorrect data structure used for collection',
    description: 'Lists are used where hash maps or sets would improve access speed.',
    severity: 'medium'
  },
  {
    id: 'f100',
    checklistItemId: 'optimization-appropriate-data-structures',
    title: 'Suboptimal algorithm implementation',
    description: 'Sorting or searching implemented with higher-than-necessary complexity.',
    severity: 'medium'
  },
  {
    id: 'f101',
    checklistItemId: 'optimization-appropriate-data-structures',
    title: 'Algorithm lacks early exit condition',
    description: 'Loops and recursive calls don’t include break conditions, increasing unnecessary computation.',
    severity: 'low'
  },
  
  {
    id: 'f102',
    checklistItemId: 'optimization-caching-implemented',
    title: 'No caching of frequent queries',
    description: 'Frequently accessed data is fetched from the database on every request without caching layer.',
    severity: 'medium'
  },
  {
    id: 'f103',
    checklistItemId: 'optimization-caching-implemented',
    title: 'Cache invalidation logic missing',
    description: 'Data remains outdated due to lack of proper cache refresh strategy.',
    severity: 'medium'
  },
  {
    id: 'f104',
    checklistItemId: 'optimization-caching-implemented',
    title: 'Improper use of client-side cache',
    description: 'Frontend caches sensitive or dynamic data without considering session or validity duration.',
    severity: 'low'
  },
  
  {
    id: 'f105',
    checklistItemId: 'optimization-scalability',
    title: 'Application fails under concurrent load',
    description: 'Stress tests reveal the system cannot handle expected number of parallel users.',
    severity: 'high'
  },
  {
    id: 'f106',
    checklistItemId: 'optimization-scalability',
    title: 'No horizontal scaling support',
    description: 'Code and deployment structure do not allow for scaling out with additional instances.',
    severity: 'medium'
  },
  {
    id: 'f107',
    checklistItemId: 'optimization-scalability',
    title: 'Shared resources limit scalability',
    description: 'Global locks or shared state reduce ability to scale under load.',
    severity: 'high'
  },
  {
    id: 'f108',
    checklistItemId: 'compatibility-platforms',
    title: 'Inconsistent behavior on different platforms',
    description: 'The application does not render or function identically on Linux vs. Windows, or across major browsers.',
    severity: 'high'
  },
  {
    id: 'f109',
    checklistItemId: 'compatibility-platforms',
    title: 'Platform-specific bugs detected',
    description: 'Bugs were observed when running the software on ARM-based systems or outdated browsers.',
    severity: 'medium'
  },
  {
    id: 'f110',
    checklistItemId: 'compatibility-platforms',
    title: 'Unsupported hardware configurations',
    description: 'The application fails to initialize on lower-spec machines or non-standard screen resolutions.',
    severity: 'medium'
  },
  
  {
    id: 'f111',
    checklistItemId: 'compatibility-dependencies-documented',
    title: 'Dependency documentation is missing',
    description: 'There is no record of third-party libraries or versions used in the project.',
    severity: 'medium'
  },
  {
    id: 'f112',
    checklistItemId: 'compatibility-dependencies-documented',
    title: 'Outdated libraries with known vulnerabilities',
    description: 'The project relies on outdated packages that have published security issues.',
    severity: 'high'
  },
  {
    id: 'f113',
    checklistItemId: 'compatibility-dependencies-documented',
    title: 'Unpinned dependencies in package managers',
    description: 'Dependencies are not locked to specific versions, leading to unpredictable builds.',
    severity: 'low'
  },
  
  {
    id: 'f114',
    checklistItemId: 'compatibility-config-externalized',
    title: 'Configuration is hardcoded in source files',
    description: 'Environment-specific values are directly embedded in the code instead of being externalized.',
    severity: 'high'
  },
  {
    id: 'f115',
    checklistItemId: 'compatibility-config-externalized',
    title: 'Lack of config separation per environment',
    description: 'No distinct configuration files for dev, staging, and production environments.',
    severity: 'medium'
  },
  {
    id: 'f116',
    checklistItemId: 'compatibility-config-externalized',
    title: 'Sensitive config values committed to VCS',
    description: 'API keys and database credentials found in configuration tracked by Git.',
    severity: 'critical'
  },
  
  {
    id: 'f117',
    checklistItemId: 'compatibility-no-hardcoded-paths',
    title: 'Hardcoded file paths detected',
    description: 'Source code includes absolute or OS-specific paths that break on other systems.',
    severity: 'medium'
  },
  {
    id: 'f118',
    checklistItemId: 'compatibility-no-hardcoded-paths',
    title: 'API endpoints are hardcoded',
    description: 'Base URLs or endpoints are written directly in code instead of being parameterized.',
    severity: 'medium'
  },
  {
    id: 'f119',
    checklistItemId: 'compatibility-no-hardcoded-paths',
    title: 'Hardcoded database connection strings',
    description: 'Credentials and DB hosts are found directly in the codebase.',
    severity: 'high'
  },
  {
    id: 'f120',
    checklistItemId: 'requirements-functional-implemented',
    title: 'Missing implementation of functional requirements',
    description: 'Some functional requirements listed in the specification are not covered in the current codebase.',
    severity: 'high'
  },
  {
    id: 'f121',
    checklistItemId: 'requirements-functional-implemented',
    title: 'Incorrect mapping of user stories to features',
    description: 'Implemented features do not fully reflect the described user stories.',
    severity: 'medium'
  },
  {
    id: 'f122',
    checklistItemId: 'requirements-functional-implemented',
    title: 'Implementation deviates from documented behavior',
    description: 'The actual behavior of the application differs from the specified functional requirements.',
    severity: 'high'
  },
  
  {
    id: 'f123',
    checklistItemId: 'requirements-nonfunctional-validated',
    title: 'Performance requirements not validated',
    description: 'No evidence of performance benchmarking or testing against expected throughput.',
    severity: 'high'
  },
  {
    id: 'f124',
    checklistItemId: 'requirements-nonfunctional-validated',
    title: 'Security validation is missing',
    description: 'There is no validation of security constraints such as authentication or data protection.',
    severity: 'high'
  },
  {
    id: 'f125',
    checklistItemId: 'requirements-nonfunctional-validated',
    title: 'Scalability not tested under load',
    description: 'The system’s performance under high user load has not been validated.',
    severity: 'medium'
  },
  
  {
    id: 'f126',
    checklistItemId: 'requirements-design-alignment',
    title: 'Code does not follow architecture diagrams',
    description: 'Discrepancies exist between the implemented structure and the design documentation.',
    severity: 'medium'
  },
  {
    id: 'f127',
    checklistItemId: 'requirements-design-alignment',
    title: 'Design patterns are not consistently applied',
    description: 'Some components do not adhere to prescribed patterns or interface contracts.',
    severity: 'medium'
  },
  {
    id: 'f128',
    checklistItemId: 'requirements-design-alignment',
    title: 'Design documentation is outdated',
    description: 'Code changes have not been reflected in the design documentation, leading to inconsistencies.',
    severity: 'low'
  },
  
  {
    id: 'f129',
    checklistItemId: 'requirements-traceability',
    title: 'No traceability matrix between code and requirements',
    description: 'There is no evidence of mapping between implemented code and documented requirements.',
    severity: 'medium'
  },
  {
    id: 'f130',
    checklistItemId: 'requirements-traceability',
    title: 'Lack of identifiers for requirement references',
    description: 'Requirements and code do not share consistent IDs or tags for cross-referencing.',
    severity: 'low'
  },
  {
    id: 'f131',
    checklistItemId: 'requirements-traceability',
    title: 'Requirements-to-test-case mapping missing',
    description: 'There is no established linkage between requirements and corresponding test cases.',
    severity: 'medium'
  },
  {
    id: 'f132',
    checklistItemId: 'artifacts-ui-prototypes-exist',
    title: 'UI/UX prototypes are missing or incomplete',
    description: 'The system lacks visual mockups or wireframes to guide front-end development.',
    severity: 'medium'
  },
  {
    id: 'f133',
    checklistItemId: 'artifacts-ui-prototypes-exist',
    title: 'UI mockups are not reviewed or approved',
    description: 'There is no evidence of stakeholder review or approval for design prototypes.',
    severity: 'medium'
  },
  {
    id: 'f134',
    checklistItemId: 'artifacts-ui-prototypes-exist',
    title: 'Inconsistency between mockups and final UI',
    description: 'The implemented UI deviates significantly from the approved design prototypes.',
    severity: 'medium'
  },
  
  {
    id: 'f135',
    checklistItemId: 'artifacts-database-schemas-documented',
    title: 'Database schema is undocumented',
    description: 'No ER diagrams or documentation exist to explain the database structure.',
    severity: 'high'
  },
  {
    id: 'f136',
    checklistItemId: 'artifacts-database-schemas-documented',
    title: 'Database changes are not versioned',
    description: 'Schema modifications are applied manually and are not tracked using migration tools.',
    severity: 'medium'
  },
  {
    id: 'f137',
    checklistItemId: 'artifacts-database-schemas-documented',
    title: 'Schema documentation is outdated',
    description: 'The current database implementation differs from the documented schema.',
    severity: 'medium'
  },
  
  {
    id: 'f138',
    checklistItemId: 'artifacts-config-files-managed',
    title: 'Configuration files are not version-controlled',
    description: 'Environment-specific settings are stored outside of version control.',
    severity: 'high'
  },
  {
    id: 'f139',
    checklistItemId: 'artifacts-config-files-managed',
    title: 'Configuration structure is inconsistent',
    description: 'The format and structure of configuration files are not standardized.',
    severity: 'medium'
  },
  {
    id: 'f140',
    checklistItemId: 'artifacts-config-files-managed',
    title: 'Sensitive config values stored in plain text',
    description: 'Passwords or tokens are stored unencrypted in configuration files.',
    severity: 'high'
  },
  
  {
    id: 'f141',
    checklistItemId: 'artifacts-ci-scripts-available',
    title: 'CI/CD scripts are missing or incomplete',
    description: 'The system lacks automated scripts for build, test, or deployment.',
    severity: 'medium'
  },
  {
    id: 'f142',
    checklistItemId: 'artifacts-ci-scripts-available',
    title: 'CI/CD scripts are outdated or not maintained',
    description: 'Automation scripts fail or are not aligned with current project structure.',
    severity: 'medium'
  },
  {
    id: 'f143',
    checklistItemId: 'artifacts-ci-scripts-available',
    title: 'No test automation in CI pipeline',
    description: 'Test execution is not included as part of the CI/CD pipeline.',
    severity: 'medium'
  },
  {
    id: 'f144',
    checklistItemId: 'pms-code-repositories-used',
    title: 'Code is not stored in version control',
    description: 'The source code is managed without a proper version control system like Git, leading to traceability and rollback issues.',
    severity: 'high'
  },
  {
    id: 'f145',
    checklistItemId: 'pms-code-repositories-used',
    title: 'Version control practices are inconsistent',
    description: 'Team members are not following branching or tagging conventions, making releases hard to manage.',
    severity: 'medium'
  },
  {
    id: 'f146',
    checklistItemId: 'pms-code-repositories-used',
    title: 'Repositories lack access control',
    description: 'There are no restrictions or audit logs for who can commit or merge code.',
    severity: 'high'
  },
  
  {
    id: 'f147',
    checklistItemId: 'pms-task-tracking-system-in-use',
    title: 'Task tracking system is not in use',
    description: 'The team does not use any platform to track progress, deadlines, or assign responsibilities.',
    severity: 'high'
  },
  {
    id: 'f148',
    checklistItemId: 'pms-task-tracking-system-in-use',
    title: 'Tasks lack clear status and ownership',
    description: 'Issues and tasks are not assigned or updated in the task tracking system.',
    severity: 'medium'
  },
  {
    id: 'f149',
    checklistItemId: 'pms-task-tracking-system-in-use',
    title: 'Sprint/iteration planning is not documented',
    description: 'Project planning data is missing in the task tracking tool.',
    severity: 'medium'
  },
  
  {
    id: 'f150',
    checklistItemId: 'pms-collaboration-tools-used',
    title: 'No collaboration platform in use',
    description: 'The team lacks a shared space for real-time communication and file sharing.',
    severity: 'medium'
  },
  {
    id: 'f151',
    checklistItemId: 'pms-collaboration-tools-used',
    title: 'Poor communication flow',
    description: 'Important discussions are scattered across different channels or not documented.',
    severity: 'low'
  },
  {
    id: 'f152',
    checklistItemId: 'pms-collaboration-tools-used',
    title: 'Decisions are not documented in collaboration tools',
    description: 'Key decisions made in chats or meetings are not logged for future reference.',
    severity: 'medium'
  },
  {
    id: 'f153',
    checklistItemId: 'infrastructure-environments-defined',
    title: 'No separate environments are defined',
    description: 'The system lacks isolated environments for development, testing, and production, leading to deployment and testing conflicts.',
    severity: 'high'
  },
  {
    id: 'f154',
    checklistItemId: 'infrastructure-environments-defined',
    title: 'Test and production environments share resources',
    description: 'Testing activities might affect production performance or stability due to shared infrastructure.',
    severity: 'high'
  },
  {
    id: 'f155',
    checklistItemId: 'infrastructure-environments-defined',
    title: 'Environments are not consistently maintained',
    description: 'Differences in configurations across environments lead to deployment issues and inconsistent behavior.',
    severity: 'medium'
  },
  
  {
    id: 'f156',
    checklistItemId: 'infrastructure-cicd-configured',
    title: 'CI/CD pipeline is not implemented',
    description: 'The team deploys code manually without automation, increasing risk of errors and slowing down delivery.',
    severity: 'high'
  },
  {
    id: 'f157',
    checklistItemId: 'infrastructure-cicd-configured',
    title: 'Pipeline fails or is unstable',
    description: 'CI/CD pipeline is unreliable and often fails without proper logging or alerting.',
    severity: 'medium'
  },
  {
    id: 'f158',
    checklistItemId: 'infrastructure-cicd-configured',
    title: 'Pipeline lacks test automation',
    description: 'No automated tests are integrated into the CI/CD process, risking defective deployments.',
    severity: 'medium'
  },
  
  {
    id: 'f159',
    checklistItemId: 'infrastructure-security-controls',
    title: 'No access control is implemented',
    description: 'Users have excessive privileges, and no authentication or authorization is enforced on the infrastructure.',
    severity: 'high'
  },
  {
    id: 'f160',
    checklistItemId: 'infrastructure-security-controls',
    title: 'Sensitive infrastructure settings are exposed',
    description: 'Secrets, keys, or credentials are hardcoded or exposed in environment variables without encryption.',
    severity: 'high'
  },
  {
    id: 'f161',
    checklistItemId: 'infrastructure-security-controls',
    title: 'No regular infrastructure security audit',
    description: 'The infrastructure has not been audited for security vulnerabilities or misconfigurations.',
    severity: 'medium'
  },
  {
    id: 'f162',
    checklistItemId: 'planning-goals-scope-resources-defined',
    title: 'Project goals and scope are not clearly defined',
    description: 'The documentation lacks clear objectives, scope statements, or resource allocation details, leading to ambiguity.',
    severity: 'high'
  },
  {
    id: 'f163',
    checklistItemId: 'planning-goals-scope-resources-defined',
    title: 'Resource estimation is incomplete',
    description: 'Human or technical resource needs are underestimated or not fully accounted for in the planning phase.',
    severity: 'medium'
  },
  {
    id: 'f164',
    checklistItemId: 'planning-risk-management-defined',
    title: 'No formal risk management plan exists',
    description: 'Project risks are not documented, and no mitigation or contingency strategies are in place.',
    severity: 'high'
  },
  {
    id: 'f165',
    checklistItemId: 'planning-schedule-tasks-assigned',
    title: 'Project tasks are not assigned to team members',
    description: 'Schedule includes milestones, but individual responsibilities are not clearly documented.',
    severity: 'high'
  },
  {
    id: 'f166',
    checklistItemId: 'planning-schedule-tasks-assigned',
    title: 'Deadlines are missing or not realistic',
    description: 'The project timeline lacks concrete deadlines or uses overly optimistic estimations.',
    severity: 'medium'
  },
  
  {
    id: 'f167',
    checklistItemId: 'requirements-collection-analysis-documentation',
    title: 'Requirements collection process is ad-hoc',
    description: 'Stakeholder input is collected informally without structured analysis or documentation.',
    severity: 'high'
  },
  {
    id: 'f168',
    checklistItemId: 'requirements-change-tracking',
    title: 'No traceability between changes and approvals',
    description: 'Changes to requirements are not traceable to stakeholders or justification documents.',
    severity: 'high'
  },
  {
    id: 'f169',
    checklistItemId: 'requirements-product-compliance',
    title: 'Requirements are not validated against product features',
    description: 'Compliance testing against documented requirements is missing or incomplete.',
    severity: 'high'
  },
  {
    id: 'f170',
    checklistItemId: 'development-code-writing-process-defined',
    title: 'Code writing process is undocumented',
    description: 'There is no formally defined process for how code should be developed, reviewed, and merged.',
    severity: 'high'
  },
  {
    id: 'f171',
    checklistItemId: 'development-coding-standards-applied',
    title: 'Coding standards are not enforced',
    description: 'No tooling or review process is used to ensure adherence to defined coding standards.',
    severity: 'high'
  },
  {
    id: 'f172',
    checklistItemId: 'development-code-review-process',
    title: 'Code changes bypass peer review',
    description: 'Developers commit directly to main branches without required review or approval.',
    severity: 'high'
  },
  {
    id: 'f173',
    checklistItemId: 'testing-plan-and-execution',
    title: 'Test plan is missing or incomplete',
    description: 'Testing activities are not formally planned or are inconsistently executed across modules.',
    severity: 'high'
  },
  {
    id: 'f174',
    checklistItemId: 'testing-automation-implemented',
    title: 'Automated tests are missing in critical areas',
    description: 'Key features lack test automation, slowing down feedback and increasing manual testing effort.',
    severity: 'medium'
  },
  {
    id: 'f175',
    checklistItemId: 'testing-defect-management',
    title: 'Defect tracking is inconsistent or absent',
    description: 'Defects are not systematically logged or followed up, making issue resolution inefficient.',
    severity: 'high'
  },
  {
    id: 'f176',
    checklistItemId: 'config-version-control',
    title: 'Source code is not properly version controlled',
    description: 'Some parts of the codebase or artifacts are not tracked in version control systems like Git or SVN.',
    severity: 'high'
  },
  {
    id: 'f177',
    checklistItemId: 'config-release-management',
    title: 'Release management process is missing or informal',
    description: 'Releases are made without consistent tagging, changelogs, or formal approval processes.',
    severity: 'high'
  },
  {
    id: 'f178',
    checklistItemId: 'config-environment-setup',
    title: 'Environment setup is not documented or reproducible',
    description: 'Setup of development, testing, or production environments is manual and not versioned.',
    severity: 'high'
  },
  {
    id: 'f179',
    checklistItemId: 'quality-standards-applied',
    title: 'Quality standards are not defined or applied',
    description: 'The project lacks documentation or practices aligned with ISO 9001 or CMMI standards.',
    severity: 'high'
  },
  {
    id: 'f180',
    checklistItemId: 'quality-internal-audits-conducted',
    title: 'No internal audits are conducted',
    description: 'There is no process for regularly auditing compliance with quality or project standards.',
    severity: 'medium'
  },
  {
    id: 'f181',
    checklistItemId: 'quality-requirements-compliance-evaluated',
    title: 'Requirements compliance is not evaluated',
    description: 'Project deliverables are not systematically checked for compliance with requirements or standards.',
    severity: 'high'
  },
  // For: release-product-process-defined
{
    id: 'f182',
    checklistItemId: 'release-product-process-defined',
    title: 'Release steps are undocumented or unclear',
    description: 'The release procedure lacks formal documentation, leading to inconsistent deployments.',
    severity: 'high'
  },
  {
    id: 'f183',
    checklistItemId: 'release-product-process-defined',
    title: 'No formal approval before release',
    description: 'Releases are deployed without management or QA approval.',
    severity: 'high'
  },
  {
    id: 'f184',
    checklistItemId: 'release-product-process-defined',
    title: 'Release checklists are not followed',
    description: 'Release activities are performed manually without checklists, increasing the chance of missing steps.',
    severity: 'medium'
  },
  
  // For: release-monitoring-logging-configured
  {
    id: 'f185',
    checklistItemId: 'release-monitoring-logging-configured',
    title: 'No production monitoring is configured',
    description: 'The production environment lacks performance or availability monitoring tools.',
    severity: 'high'
  },
  {
    id: 'f186',
    checklistItemId: 'release-monitoring-logging-configured',
    title: 'Logs are not structured or centralized',
    description: 'Application logs are scattered or unstructured, making debugging difficult.',
    severity: 'medium'
  },
  {
    id: 'f187',
    checklistItemId: 'release-monitoring-logging-configured',
    title: 'Critical errors are not logged or alerted',
    description: 'Critical application errors occur without triggering alerts.',
    severity: 'high'
  },
  
  // For: release-user-feedback-handling
  {
    id: 'f188',
    checklistItemId: 'release-user-feedback-handling',
    title: 'No user feedback channel available',
    description: 'Users have no clear way to submit feedback or report bugs.',
    severity: 'medium'
  },
  {
    id: 'f189',
    checklistItemId: 'release-user-feedback-handling',
    title: 'Feedback is not reviewed or actioned',
    description: 'Collected feedback is ignored or not used for product improvements.',
    severity: 'medium'
  },
  {
    id: 'f190',
    checklistItemId: 'release-user-feedback-handling',
    title: 'Feedback analysis is not documented',
    description: 'There is no record of analysis or prioritization of user feedback.',
    severity: 'low'
  },
  
  // For: security-data-protection-check
  {
    id: 'f191',
    checklistItemId: 'security-data-protection-check',
    title: 'Sensitive data is stored unencrypted',
    description: 'Critical user data like passwords or personal info is stored without encryption.',
    severity: 'high'
  },
  {
    id: 'f192',
    checklistItemId: 'security-data-protection-check',
    title: 'Inadequate data access control',
    description: 'Sensitive data is accessible to unauthorized roles or systems.',
    severity: 'high'
  },
  {
    id: 'f193',
    checklistItemId: 'security-data-protection-check',
    title: 'No data retention or deletion policy',
    description: 'Old or obsolete data is not deleted in compliance with privacy regulations.',
    severity: 'medium'
  },
  
  // For: security-vulnerability-testing-conducted
  {
    id: 'f194',
    checklistItemId: 'security-vulnerability-testing-conducted',
    title: 'No recent vulnerability assessments performed',
    description: 'Security assessments or penetration testing have not been conducted in the past 12 months.',
    severity: 'high'
  },
  {
    id: 'f195',
    checklistItemId: 'security-vulnerability-testing-conducted',
    title: 'Findings from vulnerability tests are not fixed',
    description: 'Known vulnerabilities were discovered but remain unaddressed.',
    severity: 'high'
  },
  {
    id: 'f196',
    checklistItemId: 'security-vulnerability-testing-conducted',
    title: 'Lack of automated security scanning',
    description: 'The CI/CD pipeline does not include automated vulnerability scans.',
    severity: 'medium'
  },
  
  // For: security-standards-compliance-verified
  {
    id: 'f197',
    checklistItemId: 'security-standards-compliance-verified',
    title: 'Security standards are not followed',
    description: 'Project lacks policies or practices aligned with ISO/IEC 27001, OWASP, or GDPR.',
    severity: 'high'
  },
  {
    id: 'f198',
    checklistItemId: 'security-standards-compliance-verified',
    title: 'No audit or evidence of compliance',
    description: 'The project does not maintain records demonstrating adherence to security standards.',
    severity: 'medium'
  },
  {
    id: 'f199',
    checklistItemId: 'security-standards-compliance-verified',
    title: 'Inconsistent application of security practices',
    description: 'Some teams or modules apply different levels of security, leading to potential gaps.',
    severity: 'medium'
  },
  // For: communication-meetings-organized
{
    id: 'f200',
    checklistItemId: 'communication-meetings-organized',
    title: 'Team meetings are irregular or missing',
    description: 'There is no consistent schedule for team coordination meetings, leading to misalignment.',
    severity: 'medium'
  },
  {
    id: 'f201',
    checklistItemId: 'communication-meetings-organized',
    title: 'Meeting outcomes are not documented',
    description: 'Decisions from team meetings are not recorded, making follow-ups difficult.',
    severity: 'low'
  },
  {
    id: 'f202',
    checklistItemId: 'communication-meetings-organized',
    title: 'Key roles often miss meetings',
    description: 'Critical team members or stakeholders are frequently absent from coordination sessions.',
    severity: 'medium'
  },
  
  // For: communication-knowledge-management
  {
    id: 'f203',
    checklistItemId: 'communication-knowledge-management',
    title: 'Project documentation is scattered or outdated',
    description: 'Information is not centralized or regularly maintained in a shared location.',
    severity: 'medium'
  },
  {
    id: 'f204',
    checklistItemId: 'communication-knowledge-management',
    title: 'Lessons learned are not captured',
    description: 'There is no process for capturing or reviewing lessons learned during or after the project.',
    severity: 'low'
  },
  {
    id: 'f205',
    checklistItemId: 'communication-knowledge-management',
    title: 'No knowledge base or wiki in use',
    description: 'The team does not maintain any structured knowledge repository.',
    severity: 'medium'
  },
  
  // For: communication-stakeholder-interaction
  {
    id: 'f206',
    checklistItemId: 'communication-stakeholder-interaction',
    title: 'Stakeholder feedback is not collected systematically',
    description: 'The team lacks a defined process to gather and address stakeholder concerns.',
    severity: 'high'
  },
  {
    id: 'f207',
    checklistItemId: 'communication-stakeholder-interaction',
    title: 'No regular communication with stakeholders',
    description: 'Stakeholders are not kept updated on project status or changes.',
    severity: 'high'
  },
  {
    id: 'f208',
    checklistItemId: 'communication-stakeholder-interaction',
    title: 'Stakeholder inputs are not reflected in decisions',
    description: 'Feedback from stakeholders is ignored or not documented during the planning process.',
    severity: 'medium'
  }                              
];
