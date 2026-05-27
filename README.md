# Aura Notes

A full-stack note-taking application built with a modern web stack. It provides a seamless experience for creating, organizing, and managing your notes with a robust backend and an interactive frontend.

## Features

- **User Authentication**: Secure sign-up and login using JWT and bcrypt.
- **Notes Management**: Create, read, update, and delete notes.
- **Tags System**: Organize notes efficiently with custom tags.
- **Responsive UI**: A modern, interactive, and fully responsive user interface.

## Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching & State Management**: TanStack React Query
- **Routing**: React Router DOM
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (via `mysql2`)
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Authentication**: JSON Web Tokens (JWT) & bcrypt

## Project Structure

- `/frontend` - Contains the React client application.
- `/backend` - Contains the Express.js server, database schema, routes, and controllers.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MySQL database

### Installation & Setup

1. **Setup Backend**:
   - Navigate to `/backend`: `cd backend`
   - Install dependencies: `npm install`
   - Create a `.env` file with your database and JWT credentials (e.g., `PORT`, `DATABASE_URL`, `JWT_SECRET`).
   - Run the server: `npm start` (or a dev script if configured).

2. **Setup Frontend**:
   - Navigate to `/frontend`: `cd frontend`
   - Install dependencies: `npm install`
   - Start the development server: `npm run dev`

The frontend application should now be accessible through the port specified by Vite (usually `http://localhost:5173`).
