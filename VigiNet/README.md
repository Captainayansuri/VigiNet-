# VigiNet — Emergency Intelligence & Rapid Response System

VigiNet is an emergency intelligence and disaster response platform designed to bridge citizen ground telemetry with field responders and command teams during critical incidents.

---

## Phase 1: Local PostgreSQL + Prisma + Persistent Backend

### 1. Prerequisites
- **Node.js**: `v20+` or `v22+` / `v24+`
- **npm**: `v10+`
- **PostgreSQL**: `v15+` or `v16+` (or Docker for Windows)

---

### 2. PostgreSQL Setup on Windows

If PostgreSQL is not yet installed on your Windows machine, choose one of the following methods:

#### Option A: Official PostgreSQL Windows Installer (Recommended)
1. Download the installer from the [official EnterpriseDB PostgreSQL download page](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Run the installer, select **PostgreSQL 16** (or 15).
3. Set the password for user `postgres` (e.g. `postgres`).
4. Keep the default port `5432`.
5. Open **pgAdmin** or PowerShell to create the database:
   ```sql
   CREATE DATABASE viginet;
   ```

#### Option B: Docker for Windows
If Docker Desktop is installed:
```powershell
docker run --name viginet-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=viginet -p 5432:5432 -d postgres:16-alpine
```

#### Option C: Chocolatey / Winget Package Manager
```powershell
winget install PostgreSQL.PostgreSQL.16
# or
choco install postgresql16 --params '/Password:postgres'
```

---

### 3. Environment Configuration

Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

Ensure `.env` contains:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/viginet?schema=public"
JWT_SECRET="viginet-development-secret-jwt-key-2026"
SESSION_SECRET="viginet-development-session-secret"
STORAGE_PROVIDER=local
LOCAL_STORAGE_DIR=./storage
CORS_ORIGIN=http://localhost:5173
```

---

### 4. Database Setup & Seeding

1. **Generate Prisma Client:**
   ```powershell
   npx prisma generate
   ```

2. **Execute Migrations:**
   ```powershell
   # Once PostgreSQL is running:
   npx prisma migrate dev --name init
   # or deploy pre-scaffolded baseline:
   npx prisma migrate deploy
   ```

3. **Seed Canonical Data:**
   ```powershell
   node prisma/seed.js
   ```

The seed script creates:
- **Canonical Incident `VN-63481`** (People Trapped in Village B) with 7 related reports, 4 evidence records, confidence, timeline, and known/unknown facts.
- Additional canonical incidents: `VN-63476`, `VN-28491`, `VN-28455`.
- Response teams (`ALPHA`, `BETA`, `GAMMA`, `DELTA`).
- Field missions (`VN-M001`, `VN-M002`, `VN-M003`, `VN-M004`).
- Alerts, Shelters, Hazards, and initial AuditEvents.
- Pre-configured user accounts with bcrypt-hashed credentials.

---

### 5. Running the Application

#### Backend Server:
```powershell
# Production run
npm run server

# Development watch mode
npm run dev:server
```
VigiNet API runs at `http://localhost:4000`.

#### Frontend Client:
```powershell
npm run dev
```
Citizen & Response UI runs at `http://localhost:5173`.

#### Run Backend Test Suite:
```powershell
npm run test:server
```

#### Build Production Frontend:
```powershell
npm run build
```

---

### 6. Development Authentication Credentials

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@viginet.internal` | `admin123` | Full system access & configuration |
| **TEAM_LEAD** | `lead@viginet.internal` | `lead123` | Team Alpha Lead, mission dispatch |
| **FIELD_RESPONDER** | `responder@viginet.internal` | `responder123` | Verification, field updates |
| **CITIZEN** | `citizen@viginet.internal` | `citizen123` | Ground report submission |

---

### 7. API Health Check & Core Endpoints

#### Health Check:
`GET http://localhost:4000/api/health`
- **When Database is Connected:**
  ```json
  { "api": "ok", "database": "ok", "timestamp": "..." }
  ```
- **When Database is Offline:**
  ```json
  { "api": "ok", "database": "unavailable", "timestamp": "..." }
  ```

#### Core Endpoints:
- `GET /api/incidents` — List all active canonical incidents
- `GET /api/incidents/:id` — Get full canonical incident (e.g. `/api/incidents/VN-63481`)
- `POST /api/incidents` — Create incident (protected: Responder/Lead/Admin)
- `PATCH /api/incidents/:id` — Update incident status/priority (protected)
- `POST /api/incidents/:id/verify` — Record verification notes/status (protected)
- `POST /api/reports` — Submit citizen ground report with deterministic correlation
- `GET /api/reports` — Query citizen reports
- `POST /api/evidence` — Save evidence media metadata (local development storage)
- `GET /api/missions` — Query active field missions
- `POST /api/missions` — Create field mission (protected: Lead/Admin)
- `PATCH /api/missions/:id/status` — Advance mission lifecycle (protected)
- `POST /api/missions/:id/field-updates` — Submit field telemetry (protected)
- `POST /api/auth/register` — Register user with bcrypt hashing
- `POST /api/auth/login` — Login user and issue JWT token
- `GET /api/auth/me` — Retrieve current authenticated user profile
