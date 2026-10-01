# Bellbird Project

Bellbird Books management system.

## Project Structure

- `frontend/` - React frontend
- `backend/` - Express backend

## Requirements

- Node.js
- npm

## Setup

### 1. Backend

Open a terminal and run:

```bash
cd backend
npm install
```

### 2. Create the Database

From the `backend` folder, run:

```bash
node src/database/initDatabase.js
```

This will create and initialise the SQLite database.

### 3. Create Admin Account

From the `backend` folder, run:

```bash
node src/database/createAdmin.js
```

This creates the admin account needed to log in to the system.

### 4. Start the Backend

```bash
npm start
```

The backend will run on:

```text
http://localhost:3000
```

### 5. Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Features

- User login
- Stock management
- Search and filter stock
- Add new and second-hand books
- Create customer orders
- Search customer orders
- View outstanding orders
- Update customer orders

## Technologies

- React
- Tailwind CSS
- Node.js
- Express
- SQLite
- JWT

## Notes

The frontend and backend must be running at the same time.
If the database is deleted or needs to be recreated, run the database initialisation and admin creation commands again.
