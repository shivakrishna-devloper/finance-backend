
# Finance Dashboard Backend

A RESTful backend API for a Finance Dashboard system built with Node.js, Express, and SQLite. Features role-based access control, financial records management, and summary analytics.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| SQLite (better-sqlite3) | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| express-rate-limit | Rate limiting |
| dotenv | Environment variables |
| morgan | HTTP request logger |

---

## Project Structure

finance-backend/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── src/
├── index.js
├── database/
│   ├── init.js
│   └── seed.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── validators/
│   ├── auth.validator.js
│   ├── user.validator.js
│   └── record.validator.js
├── services/
│   ├── auth.service.js
│   ├── user.service.js
│   ├── record.service.js
│   └── dashboard.service.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── record.controller.js
│   └── dashboard.controller.js
└── routes/
├── auth.routes.js
├── user.routes.js
├── record.routes.js
└── dashboard.routes.js


---

## Setup Instructions

### 1. Clone the repository
git clone https://github.com/shivakrishna-devloper/finance-backend.git
cd finance-backend

### 2. Install dependencies
npm install

### 3. Create environment file
Create a `.env` file in the root folder:
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
DB_PATH=./src/database/finance.db

### 4. Seed the database
node src/database/seed.js

### 5. Start the server
node src/index.js

Server runs at: `http://localhost:3000`

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@finance.com | Admin@123 |
| Analyst | analyst@finance.com | Analyst@123 |
| Viewer | viewer@finance.com | Viewer@123 |

---

## Role Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| Login / Register | ✅ | ✅ | ✅ |
| View records | ✅ | ✅ | ✅ |
| View dashboard summary | ✅ | ✅ | ✅ |
| View recent activity | ✅ | ✅ | ✅ |
| View category totals | ❌ | ✅ | ✅ |
| View monthly trends | ❌ | ✅ | ✅ |
| View weekly trends | ❌ | ✅ | ✅ |
| Create records | ❌ | ✅ | ✅ |
| Update records | ❌ | ✅ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## API Reference

### Base URL
http://localhost:3000/api/health

### Authentication Header
All protected routes require:
Authorization: Bearer your_token_here

---

### Auth Routes

#### POST /auth/register
Public. Register a new user.

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "John@123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": 4,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "status": "active",
    "created_at": "2025-04-01 10:00:00"
  }
}
```

---

#### POST /auth/login
Public. Login and get JWT token.

Request:
```json
{
  "email": "admin@finance.com",
  "password": "Admin@123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@finance.com",
      "role": "admin",
      "status": "active"
    }
  }
}
```

---

#### GET /auth/me
Protected. Get current user profile.

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@finance.com",
    "role": "admin",
    "status": "active",
    "created_at": "2025-04-01 10:00:00"
  }
}
```

---

### User Routes (Admin Only)

#### GET /users
Get all users with pagination.

Query params:
page=1&limit=10&role=viewer&status=active

Response:
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

#### GET /users/:id
Get single user by ID.

Response:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Alice Analyst",
    "email": "analyst@finance.com",
    "role": "analyst",
    "status": "active"
  }
}
```

---

#### POST /users
Create a new user.

Request:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Jane@123",
  "role": "analyst"
}
```

---

#### PUT /users/:id
Update user role or status.

Request:
```json
{
  "role": "analyst",
  "status": "inactive"
}
```

---

#### DELETE /users/:id
Delete a user permanently.

Response:
```json
{
  "success": true,
  "message": "User deleted successfully."
}
```

---

### Record Routes

#### GET /records
Get all records. All roles.

Query params:
page=1&limit=10&type=income&category=Salary&startDate=2025-01-01&endDate=2025-12-31

Response:
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "amount": 5000,
        "type": "income",
        "category": "Salary",
        "date": "2025-03-01",
        "notes": "March salary",
        "created_by_name": "Super Admin"
      }
    ],
    "pagination": {
      "total": 12,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

---

#### GET /records/:id
Get single record. All roles.

---

#### POST /records
Create record. Admin and Analyst only.

Request:
```json
{
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2025-04-01",
  "notes": "April salary"
}
```

---

#### PUT /records/:id
Update record. Admin and Analyst only.

Request:
```json
{
  "amount": 5500,
  "notes": "Updated salary amount"
}
```

---

#### DELETE /records/:id
Soft delete record. Admin only.

Response:
```json
{
  "success": true,
  "message": "Record deleted successfully."
}
```

---

### Dashboard Routes

#### GET /dashboard
Full dashboard. All roles.

Response:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalIncome": 16800,
      "totalExpenses": 4050,
      "netBalance": 12750,
      "totalRecords": 12
    },
    "categoryTotals": {
      "income": [
        { "category": "Salary", "total": 10000, "count": 2 },
        { "category": "Freelance", "total": 4300, "count": 2 }
      ],
      "expenses": [
        { "category": "Rent", "total": 2400, "count": 2 },
        { "category": "Utilities", "total": 300, "count": 1 }
      ]
    },
    "monthlyTrends": [
      { "month": "2025-04", "income": 9100, "expenses": 2000, "net": 7100 },
      { "month": "2025-03", "income": 8300, "expenses": 2050, "net": 6250 }
    ],
    "recentActivity": [...]
  }
}
```

---

#### GET /dashboard/summary
Total income, expenses, net balance. All roles.

#### GET /dashboard/categories
Category wise totals. Analyst and Admin only.

#### GET /dashboard/trends/monthly
Monthly trends for last 12 months. Analyst and Admin only.

#### GET /dashboard/trends/weekly
Weekly trends for last 8 weeks. Analyst and Admin only.

#### GET /dashboard/recent
Recent activity. All roles.

Query params:
limit=10

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request or validation failed |
| 401 | Unauthorized or invalid token |
| 403 | Forbidden or insufficient role |
| 404 | Resource not found |
| 409 | Conflict or duplicate entry |
| 429 | Too many requests |
| 500 | Internal server error |

---

## Assumptions

1. SQLite chosen for simplicity — no external database setup needed
2. Soft delete used for financial records — data preserved but hidden
3. Passwords require minimum 6 characters, one uppercase, one number
4. JWT tokens expire in 7 days by default
5. Only admins can manage users and assign roles
6. Viewers can read all records and basic dashboard data
7. Analysts can read records and access detailed analytics
8. Admins have full access to everything
9. Admin cannot delete their own account
10. Rate limiting set to 100 requests per 15 minutes

---

## Tradeoffs

| Decision | Reason |
|----------|--------|
| SQLite over PostgreSQL | Simpler setup, no external dependencies |
| Soft delete for records | Preserves data history |
| JWT over sessions | Stateless, easier to scale |
| Synchronous SQLite | Simplifies code flow |
| In-memory rate limiting | Simple implementation |
=======

>>>>>>> 2846e1d8eeea4a4ff1e940eff9caa45c24d6d9e9
