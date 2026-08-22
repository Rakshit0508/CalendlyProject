# 📅 Calendly-Inspired Scheduling Backend

A backend scheduling application inspired by Calendly, built using **TypeScript, Node.js, Express.js, PostgreSQL, Prisma, Docker, and Temporal**.

The application allows users to create event types, configure recurring availability, manage date-specific availability exceptions, generate bookable slots, and create bookings.

---

## 🚀 Features

- 👤 User Management
- 📅 Event Type Management
- 🌐 Public Event Lookup using Slugs
- ⏰ Recurring Availability Rules
- 📌 Date-Specific Availability Exceptions
- 🕒 Available Slot Generation
- 🤝 Appointment Booking
- ✅ Request Validation
- 🗄️ PostgreSQL Database Integration
- 🔄 Prisma ORM and Database Migrations
- 📧 Email Support
- ⚙️ Background Workflow Support using Temporal
- 🐳 Docker-based Local Development

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Type-safe backend development |
| Node.js | Backend runtime |
| Express.js | REST API development |
| PostgreSQL | Relational database |
| Prisma | ORM and database migrations |
| Zod | Request validation |
| Temporal | Background workflow support |
| Nodemailer | Email functionality |
| Luxon | Date and time handling |
| Docker | Containerized development |
| pnpm | Package management |

---

# 📁 Project Structure

The project follows a layered backend architecture.

```text
CalendlyProject/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   │
│   ├── config/
│   │
│   ├── controllers/
│   │   ├── user.controller.ts
│   │   ├── event-type.controller.ts
│   │   ├── availability.controller.ts
│   │   └── booking.controller.ts
│   │
│   ├── dtos/
│   │
│   ├── mailer/
│   │
│   ├── middlewares/
│   │   ├── validate.ts
│   │   ├── require-user-id.ts
│   │   ├── error-handler.ts
│   │   └── route-not-found.ts
│   │
│   ├── repositories/
│   │
│   ├── routers/
│   │   ├── user.router.ts
│   │   ├── event-type.router.ts
│   │   ├── public-event.router.ts
│   │   ├── availability.router.ts
│   │   └── bookings.router.ts
│   │
│   ├── services/
│   │
│   ├── temporal/
│   │   └── worker.ts
│   │
│   ├── utils/
│   │
│   ├── app.ts
│   └── server.ts
│
├── temporal/
│   └── dynamicConfig/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
├── prisma.config.ts
└── tsconfig.json
```

---

# 🏗️ Application Architecture

The application separates HTTP handling, business logic, and database operations into different layers.

```mermaid
flowchart TD

    A[Client / Frontend] --> B[Express Routes]

    B --> C[Middleware]

    C --> D[Controllers]

    D --> E[Services]

    E --> F[Repositories]

    F --> G[Prisma ORM]

    G --> H[(PostgreSQL)]

    C --> C1[Request Validation]
    C --> C2[User Context Validation]
    C --> C3[Error Handling]
```

## Layer Responsibilities

### Routes

Routes define API endpoints and connect incoming requests to the appropriate controller.

### Middleware

Middleware handles common request processing such as:

- Request validation
- User context validation
- Error handling
- Unknown route handling

### Controllers

Controllers:

- Receive HTTP requests
- Extract request data
- Call the appropriate service
- Return HTTP responses

### Services

Services contain the main business logic of the application.

Examples include:

- Creating users
- Managing event types
- Managing availability
- Generating slots
- Processing bookings

### Repositories

Repositories handle database operations and isolate Prisma queries from the business logic layer.

### Prisma

Prisma provides:

- Type-safe database access
- Database migrations
- Database schema management

---

# 🗄️ Database Design

The scheduling system contains multiple related entities.

```mermaid
erDiagram

    USER ||--o{ EVENT_TYPE : creates
    USER ||--o{ AVAILABILITY_RULE : defines
    USER ||--o{ AVAILABILITY_EXCEPTION : creates
    USER ||--o{ SLOT : owns

    EVENT_TYPE ||--o{ SLOT : generates
    EVENT_TYPE ||--o{ BOOKING : belongs_to

    SLOT ||--o| BOOKING : reserved_by
```

---

## 👤 User

A user represents the host who creates event types and manages availability.

Typical user information includes:

- User ID
- Name
- Email
- Slug
- Timezone

---

## 📅 Event Type

An event type represents a type of meeting offered by a user.

Examples:

- 15 Minute Quick Call
- 30 Minute Meeting
- 60 Minute Consultation

An event type may include:

- Title
- Description
- Duration
- Slug
- Location Type
- Location Value
- Buffer Before
- Buffer After
- Active Status

---

## ⏰ Availability Rules

Availability rules define recurring availability.

For example:

```text
Monday

09:00 AM
   │
   │ Available
   │
05:00 PM
```

The scheduling system uses these rules as the base availability for slot generation.

---

## 📌 Availability Exceptions

Availability exceptions override recurring availability for a specific date.

For example:

**Normal availability:**

Monday to Friday  
09:00 AM to 05:00 PM

A user can create an exception:

```text
Date: 2026-09-15

Status: Unavailable
```

This allows the application to handle:

- Holidays
- Leave
- Custom working hours
- Special availability

---

## 🕒 Slots

Slots represent bookable time windows.

For example:

```text
09:00 ─── 09:30

09:30 ─── 10:00

10:00 ─── 10:30

10:30 ─── 11:00
```

Slots are generated based on:

- Event duration
- Availability rules
- Availability exceptions
- Existing bookings
- Meeting buffers

---

## 🤝 Bookings

A booking represents an appointment created for a specific slot.

Booking information can include:

- Host User
- Event Type
- Slot
- Invitee Name
- Invitee Email
- Invitee Notes
- Booking Status
- Meeting Link
- Cancellation Information

---

# 🔄 Scheduling Workflow

The overall scheduling flow is:

```mermaid
flowchart TD

    A[Host Creates Event Type]
        --> B[Host Configures Availability]

    B --> C[Availability Rules]

    B --> D[Availability Exceptions]

    C --> E[Slot Generation]

    D --> E

    E --> F[Available Slots]

    F --> G[Invitee Selects Slot]

    G --> H[Booking Request]

    H --> I[Request Validation]

    I --> J[Booking Service]

    J --> K[(PostgreSQL)]
```

---

# 🔌 API Reference

All application APIs are exposed under the `/api` prefix.

---

## ❤️ Health API

### Check Application Health

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "timestamp": "2026-08-22T10:00:00.000Z"
}
```

---

# 👤 User APIs

Base path:

```text
/api/users
```

### Get All Users

```http
GET /api/users
```

### Create User

```http
POST /api/users/create
```

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Get User by ID

```http
GET /api/users/:userId
```

### Update User

```http
PUT /api/users/update/:userId
```

### Delete User

```http
DELETE /api/users/delete/:userId
```

---

# 📅 Event Type APIs

Base path:

```text
/api/event-types
```

### Get Event Types

```http
GET /api/event-types
```

### Get Event Type

```http
GET /api/event-types/:eventTypeId
```

### Create Event Type

```http
POST /api/event-types
```

Example request:

```json
{
  "title": "30 Minute Meeting",
  "description": "A quick discussion",
  "durationMinutes": 30,
  "locationType": "Online"
}
```

### Update Event Type

```http
PATCH /api/event-types/:eventTypeId
```

### Delete Event Type

```http
DELETE /api/event-types/:eventTypeId
```

---

# 🌐 Public Event API

Public event information can be accessed using an event slug.

```http
GET /api/public/users/event-types/:slug
```

Example:

```text
/api/public/users/event-types/30-minute-meeting
```

This provides a cleaner public URL instead of exposing internal database IDs.

---

# ⏰ Availability APIs

Base path:

```text
/api/availability
```

## Availability Rules

### Get Availability Rules

```http
GET /api/availability/rules
```

### Get Rule by ID

```http
GET /api/availability/rule/:ruleId
```

### Create Rule

```http
POST /api/availability/rule
```

Example request:

```json
{
  "weekday": 1,
  "startTime": "09:00",
  "endTime": "17:00"
}
```

### Update Rule

```http
PATCH /api/availability/rule/:ruleId
```

### Delete Rule

```http
DELETE /api/availability/rule/:ruleId
```

---

## Availability Exceptions

### Get Exceptions

```http
GET /api/availability/exceptions
```

### Get Exception

```http
GET /api/availability/exception/:exceptionId
```

### Create Exception

```http
POST /api/availability/exception
```

### Update Exception

```http
PATCH /api/availability/exception/:exceptionId
```

### Delete Exception

```http
DELETE /api/availability/exception/:exceptionId
```

### Get Exceptions by Date Range

```http
GET /api/availability/exceptions/range
```

---

# 🤝 Booking APIs

Base path:

```text
/api/bookings
```

### Create Booking

```http
POST /api/bookings
```

The booking workflow:

```mermaid
flowchart TD

    A[Booking Request]
        --> B[Request Validation]

    B --> C[Booking Service]

    C --> D[Validate Slot]

    D --> E[Create Booking]

    E --> F[(PostgreSQL)]
```

---

# ✅ Request Validation Flow

Incoming requests are validated before reaching the business logic layer.

```mermaid
flowchart TD

    A[Client Request]
        --> B{Validation Middleware}

    B -->|Invalid| C[Return Error Response]

    B -->|Valid| D[Controller]

    D --> E[Service]
```

This prevents malformed or incomplete data from reaching downstream application layers.

---

# ❌ Error Handling

The application uses centralized error handling.

```mermaid
flowchart TD

    A[Route]
        --> B[Controller]

    B --> C[Service]

    C -->|Error| D[Error Middleware]

    D --> E[HTTP Error Response]
```

---

# ⚙️ Temporal Workflow Support

The application includes a Temporal worker for executing background workflows separately from the main Express API.

```mermaid
flowchart LR

    A[Express API]
        --> B[Temporal Workflow]

    B --> C[Temporal Server]

    C --> D[Temporal Worker]
```

Start the Temporal worker:

```bash
pnpm dev:worker
```

---

# 📧 Email Support

The project uses Nodemailer for email functionality.

For local development, MailHog can be used to capture and inspect outgoing emails.

```mermaid
flowchart LR

    A[Application]
        --> B[Nodemailer]

    B --> C[MailHog SMTP]

    C --> D[MailHog Web UI]
```

MailHog UI:

```text
http://localhost:8025
```

---

# 🐳 Docker Architecture

The application can run as a multi-container development environment.

```mermaid
flowchart TD

    A[Express API :3001]

    A --> B[(PostgreSQL)]
    A --> C[Temporal Server :7233]
    A --> D[MailHog SMTP :1025]

    C --> E[Temporal UI :8080]

    C --> F[Temporal Worker]
```

The Docker environment includes:

- Backend API
- PostgreSQL
- Temporal Server
- Temporal UI
- Temporal Worker
- MailHog

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

- Node.js
- pnpm
- Docker
- Docker Compose

---

## 1. Clone the Repository

```bash
git clone https://github.com/Rakshit0508/CalendlyProject.git
```

Move into the project:

```bash
cd CalendlyProject
```

---

## 2. Install Dependencies

```bash
pnpm install
```

---

## 3. Configure Environment Variables

Create a `.env` file:

```env
PORT=3001

DATABASE_URL="postgresql://postgres:password@localhost:5433/calendly_db"

SLOT_GENERATION_DAYS=30

TEMPORAL_ADDRESS="localhost:7233"
TEMPORAL_NAMESPACE="default"
TEMPORAL_TASK_QUEUE="calendly-tasks"
```

> Do not commit real credentials or secrets to the repository.

---

## 4. Run Database Migrations

```bash
pnpm prisma:migrate
```

Generate the Prisma Client:

```bash
pnpm prisma:generate
```

Seed the database:

```bash
pnpm seed
```

---

## 5. Start the Application

```bash
pnpm dev
```

The API will run on:

```text
http://localhost:3001
```

---

# 🐳 Running with Docker

Build and start all services:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

Stop the containers:

```bash
docker compose down
```

---

# 🌐 Available Services

| Service | Address |
|---|---|
| Backend API | `http://localhost:3001` |
| PostgreSQL | `localhost:5433` |
| Temporal Server | `localhost:7233` |
| Temporal UI | `http://localhost:8080` |
| MailHog SMTP | `localhost:1025` |
| MailHog UI | `http://localhost:8025` |

---

# 🧪 Useful Commands

### Start Development Server

```bash
pnpm dev
```

### Start Temporal Worker

```bash
pnpm dev:worker
```

### Run Prisma Migration

```bash
pnpm prisma:migrate
```

### Generate Prisma Client

```bash
pnpm prisma:generate
```

### Open Prisma Studio

```bash
pnpm studio
```

---

# 📚 Key Concepts Demonstrated

This project demonstrates:

- REST API Development
- TypeScript Backend Development
- Layered Architecture
- Express Middleware
- Controller-Service-Repository Pattern
- Request Validation
- PostgreSQL Database Design
- Prisma ORM
- Database Migrations
- Availability Management
- Availability Exceptions
- Time Slot Generation
- Appointment Booking
- Public Slug-based APIs
- Centralized Error Handling
- Docker Networking
- Multi-container Applications
- Background Workflow Support
- Email Testing

---

# 🔮 Future Improvements

- Authentication and Authorization
- JWT-based Login
- Pagination for List APIs
- Rate Limiting
- Unit Testing
- Integration Testing
- Redis Caching
- Booking Cancellation
- Booking Rescheduling
- Calendar Provider Integration
- Improved Timezone Handling
- CI/CD Pipeline
- Cloud Deployment

---

# 👨‍💻 Author

**Rakshit Singhal**

- LinkedIn: https://www.linkedin.com/in/rakshit-singhal-20332a223/
- GitHub: https://github.com/Rakshit0508
