# GymOS Backend Schema Design (NestJS + PostgreSQL)

This document outlines the database structure and entity relationships for the GymOS back-end, optimized for multi-tenancy and high performance.

## 1. Core & Auth Module

### Tables: `tenants`, `users`, `locations`

```mermaid
erDiagram
    TENANT ||--o{ LOCATION : "operates"
    TENANT ||--o{ USER : "owns"
    LOCATION ||--o{ USER_LOCATION : "assigned staff"
    USER ||--o{ USER_LOCATION : "works at"

    TENANT {
        uuid id PK
        string name
        string plan "Enterprise | Pro | Standard"
        string status "Active | Inactive | Suspended"
        string logo_url
        string contact_email
        jsonb features
        jsonb settings
        boolean has_locations
        timestamp created_at
    }

    USER {
        uuid id PK
        uuid tenant_id FK
        string name
        string email
        string password_hash
        string role "AdminGlobal | Member | etc"
        string avatar_url
        timestamp last_login
    }

    LOCATION {
        uuid id PK
        uuid tenant_id FK
        string name
        string address
        string city
        boolean is_active
    }

    USER_LOCATION {
        uuid user_id PK,FK
        uuid location_id PK,FK
    }
```

## 2. Membership & Finance Module

### Tables: `members`, `subscription_plans`, `payments`, `late_payment_settings`

```mermaid
erDiagram
    MEMBER ||--o{ PAYMENT : "makes"
    TENANT ||--o{ SUBSCRIPTION_PLAN : "offers"
    MEMBER }o--|| SUBSCRIPTION_PLAN : "subscribed to"
    TENANT ||--|| LATE_PAYMENT_SETTINGS : "configures"

    MEMBER {
        uuid id PK "FK to User"
        string first_name
        string last_name
        string dni
        string status "Active | Inactive"
        date plan_expiration
        uuid assigned_trainer_id FK
        uuid assigned_location_id FK
        text observations
    }

    SUBSCRIPTION_PLAN {
        uuid id PK
        uuid tenant_id FK
        string name
        decimal price
        integer duration_months
        jsonb features
        boolean is_active
    }

    PAYMENT {
        uuid id PK
        uuid member_id FK
        uuid tenant_id FK
        uuid location_id FK
        decimal amount
        decimal paid_amount
        string status "Paid | Pending"
        string method "Cash | Card"
        date due_date
        timestamp paid_date
    }

    LATE_PAYMENT_SETTINGS {
        uuid tenant_id PK,FK
        decimal interest_per_day
        decimal late_fee
        integer grace_period_days
    }
```

## 3. Training & Performance Module

### Tables: `exercises`, `routines`, `routine_items`, `check_ins`

```mermaid
erDiagram
    ROUTINE ||--o{ ROUTINE_ITEM : "contains"
    EXERCISE ||--o{ ROUTINE_ITEM : "used in"
    MEMBER ||--o{ ROUTINE : "follows"
    MEMBER ||--o{ CHECK_IN : "records"

    EXERCISE {
        uuid id PK
        string name
        string muscle_group
        string video_url
    }

    ROUTINE {
        uuid id PK
        uuid tenant_id FK
        string name
        string difficulty
    }

    ROUTINE_ITEM {
        uuid id PK
        uuid routine_id FK
        uuid exercise_id FK
        integer sets
        string reps
        integer rest_seconds
    }

    CHECK_IN {
        uuid id PK
        uuid member_id FK
        uuid location_id FK
        timestamp timestamp
        string type "QR | DNI"
        string status "Allowed | Denied"
    }
```

## 4. Operational & UI Module

### Tables: `classes`, `class_sessions`, `messages`, `user_dashboard_configs`

```mermaid
erDiagram
    USER ||--o{ MESSAGE : "communicates"
    USER ||--o{ DASHBOARD_CONFIG : "personalizes"

    DASHBOARD_CONFIG {
        uuid id PK
        uuid user_id FK
        string role
        jsonb widget_order
    }

    MESSAGE {
        uuid id PK
        uuid sender_id FK
        uuid tenant_id FK
        string target_type
        uuid target_id
        string title
        text content
        boolean is_read
        timestamp created_at
    }
```

## 5. Operations & Logistics

### Tables: `gym_services`, `cash_register_sessions`, `cash_movements`

```mermaid
erDiagram
    TENANT ||--o{ GYM_SERVICE : "offers"
    LOCATION ||--o{ CASH_REGISTER_SESSION : "manages"
    CASH_REGISTER_SESSION ||--o{ CASH_MOVEMENT : "contains"
    PAYMENT ||--o| CASH_MOVEMENT : "registers as"

    GYM_SERVICE {
        uuid id PK
        uuid tenant_id FK
        string name
        decimal price
        string category
    }

    CASH_REGISTER_SESSION {
        uuid id PK
        uuid location_id FK
        uuid opened_by FK
        timestamp opened_at
        decimal opening_balance
        decimal closing_balance
        string status "Open | Closed"
    }

    CASH_MOVEMENT {
        uuid id PK
        uuid session_id FK
        uuid performed_by FK
        decimal amount
        string type
        string concept
        uuid payment_id FK
    }
```

## 6. NestJS Implementation Details

### Recommended Project Structure

```text
src/
├── app.module.ts
├── common/             # Interceptors, Filters, Guards
├── modules/
│   ├── auth/           # Passport, JWT
│   ├── tenant/         # Tenants & Locations
│   ├── user/           # Users & Dashboard Configs
│   ├── membership/     # Members, Plans & Payments
│   ├── training/       # Routines & Exercises
│   └── scheduler/      # Classes & Sessions
└── database/
    └── migrations/     # TypeORM/Prisma migrations
```

### Key Technical Decisions

1.  **Multi-tenancy**: Use a **Shared Database + Discriminator Column (`tenant_id`)**. It is the most scalable approach for SaaS.
2.  **JSONB**: Used for `dashboard_configs` and `tenant_features` to allow UI flexibility without frequent schema migrations.
3.  **Soft Deletes**: Implement `deleted_at` across critical tables (Users, Members, Plans) to preserve financial history.
4.  **Indexes**: Ensure composite indexes on `(tenant_id, id)` and `(member_id, status)` for fast filtering.
