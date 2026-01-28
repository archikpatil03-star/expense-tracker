# Expense Tracker (MERN)

A simple, local-first Expense Tracker application using React, Node.js, Express, and MySQL (via Docker).

## Prerequisites

- **Node.js** (v18 or higher)
- **Docker** & Docker Compose (for the database)

## Quick Start (Local)

### 1. Database Setup
Start the MySQL database using Docker:
```bash
docker-compose up -d
```
This starts MySQL on port **3308**.

### 2. Backend Setup
1. Open a terminal in the project root.
2. Navigate to `server/`:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment:
   ```bash
   cp .env.example .env
   ```
   *The default settings in `.env.example` work out-of-the-box with the Docker setup.*

5. Start the backend:
   ```bash
   npm run dev
   ```
   Server runs on: [http://localhost:5001](http://localhost:5001)

### 3. Frontend Setup
1. Open a **new terminal**.
2. Navigate to `client/`:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment:
   ```bash
   cp .env.example .env
   ```
   *Defaults to `VITE_API_URL=http://localhost:5001`.*

5. Start the frontend:
   ```bash
   npm run dev
   ```
   App runs on: [http://localhost:5173](http://localhost:5173) (or similar port)

## Troubleshooting

- **Port Conflicts**: If port 5001 or 5173 is busy, check running processes or update `.env` files.
- **Database Connection**: Ensure Docker is running. The app connects to `localhost:3308`.
- **Database Init**: Tables are automatically created (`initDb.js`) when the server starts.
