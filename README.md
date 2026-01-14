
# Overview

   Automatically generate personalised study and practice
                    schedules with web-scraped university timetables. Upload
                    your notes and past papers to create practice exams exam content
                    powered by AI.




# User Interface
### Onboarding Screens

| Welcome |  
|-------------------| 
| <img src="./screenshots/1.png" width="85%" /> 

| Login | Sign Up |
|--------|--------|
| <img src="./screenshots/1.png" width="85%" /> | <img src="./screenshots/1b.png" width="85%" /> |



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


### Folder Structure & Tech Stack
```
├── backend
│   ├── prisma
│   ├── src
│   │   ├── controllers
│   │   ├── db
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── validations
│   └── uploads
└── scrapper
    ├── app.py
    ├── db.py
    ├── schemas.py
    └── scrapper
        ├── parse.py
        ├── persist.py
        └── jobs.py
```

| Language | Framework / Runtime |
|----------|---------------------|
| TypeScript | NodeJS (Express), Prisma ORM |
| Python | Flask,  BeautifulSoup |
| SQL | PostgreSQL |
| NoSQL | MongoDB |


<br>


### Overview of Data Flow
```mermaid
flowchart LR
    FE[Frontend] -->|JWT| API[[Express API]]
    API -->|users + refresh tokens| PSQL[(PostgreSQL)]
    API -->|profiles, schedules, exams| MONGO[(MongoDB)]
    API -->|study plans + exam gen| LLM[[OpenAI Chat Completions]]
    SCRAPE[Flask scrapper] -->|parsed modules| MONGO
    FE -->|calendar + modules| API
```
### Authentication & Authorization
Email/password auth with Argon2 hashes in Postgres via Prisma; refresh tokens are hashed+stored with JTIs, access tokens are short-lived JWTs. MongoDB holds the profile document; `requireAuth` checks a valid bearer token plus an active refresh token record.

```mermaid
flowchart LR
    FE[Frontend] -- register/login --> API[[Express API]]
    API -- hash & persist creds --> PSQL[(PostgreSQL via Prisma)]
    API -- create profile doc --> MONGO[(MongoDB)]
    API -- issue access+refresh JWTs --> FE
    FE -->|Bearer access| API
    API -- verify refresh hash --> PSQL
```

### Sign in/Sign up Sequence
```mermaid
sequenceDiagram
    actor Client
    participant API as Express API
    participant PSQL as PostgreSQL (Prisma)
    participant M as MongoDB

    Client ->> API: POST /users (register)
    API ->> PSQL: store email + argon2 hash
    API ->> M: insert user profile doc
    API -->> Client: accessToken + refreshToken

    Client ->> API: POST /auth/login
    API ->> PSQL: verify password hash
    API ->> PSQL: persist refreshToken hash + jti
    API -->> Client: accessToken + refreshToken

    Client ->> API: POST /auth/refresh
    API ->> PSQL: verify refresh token hash
    API -->> Client: new accessToken
```

### Ingestion & AI Pipeline
```mermaid
sequenceDiagram
    participant FE as Frontend
    participant API as Express API
    participant LLM as OpenAI
    participant M as MongoDB

    FE->>API: POST /api/schedules/generate (modules, JWT)
    API->>LLM: generateSchedule (json_schema)
    LLM-->>API: schedules[{events, exams}]
    API->>M: insert into user_schedules
    API-->>FE: schedule ids + titles

    FE->>API: POST /api/exam (PDFs, scheduleId, JWT)
    API->>LLM: generateExam (file uploads + prompt)
    LLM-->>API: questions JSON
    API->>M: save user_exams linked to schedule
    API-->>FE: examForeignKey + scheduleId
```

### Scrapper Flow
```mermaid
flowchart LR
    SCRAPE["Flask scrapper"]
    HTML["Raw timetable HTML"]
    GROUPS["dept → exams grouped"]
    MONGO[("MongoDB rhodes_modules_timetable")]
    
 

    SCRAPE -->|"GET $TIMETABLE_URL via httpx"| HTML
    SCRAPE -->|"parse table (bs4)"| GROUPS
    SCRAPE -->|"upsert categories + exams"| MONGO
```


