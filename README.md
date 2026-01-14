
# Overview





<!-- ![image info](./screenshots/1.png) -->

# User Interface
### Onboarding Screens

| Welcome |  
|-------------------| 
| <img src="./screenshots/1.png" width="85%" /> 

| Login | Sign Up |
|--------|--------|
| <img src="./screenshots/1c.png" width="85%" /> | <img src="./screenshots/1b.png" width="85%" /> |



### Dashboard Screens

| All Kanban Overview | Single Kanban Overview |
|--------|--------|
| <img src="./screenshots/2.png" width="85%" /> | <img src="./screenshots/3.png" width="85%" /> |


| Exams | Create Exam |
|-------------------|-------|
| <img src="./screenshots/4.png" width="85%" /> | <img src="./screenshots/5.png" width="85%" /> |


| Exam Content | Exam Content B |
|--------|--------|
| <img src="./screenshots/6.png" width="85%" /> | <img src="./screenshots/7.png" width="85%" /> |

| Create Exam  | Exam Content  |
|--------|--------|
| <img src="./screenshots/8.png" width="85%" /> | <img src="./screenshots/8b.png" width="85%" /> |

### Calendar Screens

| Agenda | Calendar|
|--------|--------|
| <img src="./screenshots/9.png" width="85%" /> | <img src="./screenshots/10.png" width="85%" /> |

| All Kanban Overview | Single Kanban Overview |
|--------|--------|
| <img src="./screenshots/11.png" width="85%" /> | <img src="./screenshots/10.png" width="85%" /> |

### Profile
| Profile | Profile Delete |
|--------|--------|
| <img src="./screenshots/11.png" width="85%" /> | <img src="./screenshots/12.png" width="85%" /> |

# Backend Architecture

--

### Folder Structure & Tech Stack
```
├── core-service
│   ├── Controllers
│   ├── Data
│   ├── Infrastructure
│   ├── Models
│   └── Services
└── ai-service
    ├── src
    │   ├── config
    │   ├── controllers
    │   ├── db
    │   ├── llm
    │   ├── mappers
    │   ├── routes
    │   └── services
    └── package.json
```

| Language | Framework / Runtime |
|----------|---------------------|
| C# | ASP.NET Core |
| TypeScript | NodeJS (Express)  |
| SQL | PostgreSQL (EF Core) |

<br>



### Authentication & Authorization
--

```mermaid
flowchart LR
    FE[Frontend] -- email OTP login --> Clerk[[Clerk Auth]]
    API[[core-service]] -- validates JWT --> Clerk
    API --> Postgres[(PostgreSQL)]
    API --> Mongo[(MongoDB)]
    FE -->|JWT| API
```

### Sign in/Sign up Sequence
```mermaid
sequenceDiagram
    actor Client
    Client ->> ClerkAuth: start email sign-in (OTP)
    ClerkAuth ->> Client: send OTP to email
    Client ->> ClerkAuth: verify OTP
    ClerkAuth ->> Client: issue session + JWT

    Client ->> API: request account & dashboards with JWT
    alt first-time user
        API ->> ClerkAuth: fetch user info
        API ->> Postgres: create user-owned rows
        API ->> Mongo: init dashboard space
        API -->> Client: mark as new user
    else existing user
        API ->> Postgres: load budgets/transactions
        API ->> Mongo: load dashboard aggregates
    end
    API -->> Client: return account + dashboard data
```

### Ingestion & AI Pipeline
```mermaid
sequenceDiagram
    participant FE as Frontend
    participant API as core-service
    participant AI as ai-service
    participant LLM as OpenAI
    participant M as MongoDB

    FE->>API: POST /api/dashboards (multipart PDFs, JWT)
    API->>AI: Forward PDFs + x-user-id header
    AI->>AI: Validate request (multer, guards)
    AI->>LLM: Run extractors (tx, income/expense, categories, overview)
    LLM-->>AI: Structured JSON arrays
    AI->>M: Insert/append dashboard doc + aggregates
    AI-->>API: dashboardId + counts
    API-->>FE: dashboard created/updated
```

### Data Flow
```mermaid
flowchart LR
    FE[Frontend] -->|JWT| API[core-service]
    API -->|budgets + transactions| PSQL[(PostgreSQL)]
    API -->|read dashboards| MONGO[(MongoDB)]
    API -->|ingest PDFs| AI[ai-service]
    AI -->|LLM extraction| OpenAI[[OpenAI Chat Completions]]
    AI -->|write dashboards| MONGO
```
