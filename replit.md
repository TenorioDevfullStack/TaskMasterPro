# Replit.md

## Overview

This is a full-stack task and appointment management application built with a modern React frontend and Express.js backend. The application allows users to create, edit, and manage tasks and appointments with features like categorization, reminders, and completion tracking. The architecture follows a clean separation between client and server with shared TypeScript schemas for type safety.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Validation**: Zod schemas shared between client and server
- **Development**: Hot reload with tsx and Vite middleware integration

### Key Components

#### Database Schema
- **Tasks Table**: Stores user tasks with title, description, category, date, time, completion status, and reminder settings
- **Appointments Table**: Stores appointments with title, description, location, date range (start/end time), and reminder settings

#### API Structure
RESTful API endpoints for both tasks and appointments:
- `GET /api/tasks` - Retrieve all tasks
- `GET /api/tasks/:id` - Retrieve specific task
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- Similar endpoints exist for appointments

#### Storage Layer
Flexible storage interface with current in-memory implementation (`MemStorage`) that can be easily swapped for database implementation. The interface defines standard CRUD operations for both tasks and appointments.

## Data Flow

1. **Client Requests**: React components use TanStack Query hooks to fetch data from API endpoints
2. **API Layer**: Express routes handle HTTP requests, validate data using Zod schemas
3. **Storage Layer**: Storage interface abstracts data operations, currently using in-memory storage
4. **Response Flow**: Data flows back through the same layers with appropriate error handling and loading states

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Zod integration for form validation
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for managing component variants
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development
- Uses Vite dev server with hot module replacement
- Express server runs with tsx for TypeScript execution
- Database migrations handled through Drizzle Kit

### Production
- Frontend built with Vite and served as static files
- Backend compiled with esbuild for Node.js execution
- Configured for Replit's autoscale deployment target
- PostgreSQL database provisioned through Replit's database service

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Production/development mode switching via `NODE_ENV`
- Replit-specific optimizations when `REPL_ID` is present

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 14, 2025. Initial setup