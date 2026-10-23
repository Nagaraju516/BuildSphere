# BuildSphere Entity Relationship & Data Dictionary

`mermaid
erDiagram
    PROPERTY ||--o{ DUE_DILIGENCE_ITEM : contains
    PROPERTY ||--o{ PROPERTY_INQUIRY : receives
    PRODUCT ||--o{ ORDER_ITEM : ordered_in
    ORDER ||--|{ ORDER_ITEM : consists_of
    PROVIDER ||--o{ SERVICE_BOOKING : assigned_to
    EQUIPMENT ||--o{ EQUIPMENT_RENTAL : reserved_as
    PROJECT ||--|{ PROJECT_MILESTONE : tracks
    PROJECT ||--o{ SNAG_ITEM : inspects
    PROJECT ||--o{ EXPENSE_RECORD : incurs
`
"@ "docs(schema): add database schema and Mermaid ER diagram"

# Commit 26: Security Policy
Commit-File "docs/SECURITY_POLICY.md" @"
# Security Policy & Safe Architecture

## Zero-Credential Architecture
BuildSphere requires zero third-party API secrets, payment gateway tokens, or cloud API keys. All state is securely sandboxed in client-side storage with input validation.

## Reporting a Vulnerability
To report security concerns, please email security@buildsphere.local.
