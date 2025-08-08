# Hospital Management System - HNSM

## Overview

This is a comprehensive hospital management system for Hôpital National Simão Mendes in Guinea-Bissau. The application provides a centralized digital platform for managing all aspects of hospital operations including patient records, appointments, staff scheduling, inventory management, laboratory tests, and financial transactions. Built as a full-stack web application, it aims to digitize hospital workflows, improve care quality, optimize resource utilization, and enhance transparency in hospital operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with a custom healthcare-themed design system using Shadcn/ui components
- **Routing**: Wouter for client-side routing with role-based access control
- **State Management**: TanStack React Query for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **UI Components**: Radix UI primitives with custom styling for accessibility and consistency

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with structured error handling and request logging
- **Authentication**: Basic username/password authentication with role-based authorization
- **Session Management**: Express sessions with PostgreSQL session store

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle migrations for version-controlled database changes
- **Data Validation**: Zod schemas shared between client and server for consistent validation
- **Storage Pattern**: Repository pattern with in-memory fallback for development

### Authentication and Authorization
- **Authentication Method**: Username/password with server-side session management
- **Authorization**: Role-based access control (admin, doctor, nurse, secretary, laborant, pharmacist)
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Security**: Basic password validation (intended for enhancement with proper hashing)

### Core Domain Models
- **User Management**: Staff accounts with role-based permissions and department assignment
- **Patient Management**: Comprehensive patient records with medical history and demographics
- **Appointment System**: Scheduling with doctor-patient assignment and status tracking
- **Medical Records**: Visit history, diagnoses, treatments, and prescriptions
- **Inventory Management**: Stock tracking for medications, supplies, and equipment with low-stock alerts
- **Laboratory System**: Test ordering, processing, and result management
- **Financial Tracking**: Payment processing, billing, and financial reporting
- **Hospitalization**: Bed management and patient admission/discharge workflows

### Development Tools
- **Build System**: Vite with hot module replacement and development optimizations
- **Type Safety**: Full TypeScript coverage with strict mode enabled
- **Code Quality**: ESLint configuration with React and TypeScript rules
- **Path Aliases**: Organized imports with @ prefixes for clean module resolution

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migration and schema management tooling

### UI and Styling
- **Radix UI**: Accessible component primitives for form controls and interactive elements
- **Tailwind CSS**: Utility-first CSS framework with custom healthcare color scheme
- **Lucide React**: Consistent icon library for medical and administrative interfaces
- **Inter Font**: Modern typography via Google Fonts for improved readability

### Development Infrastructure
- **Replit Integration**: Development environment with hot reloading and error overlay
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins
- **ESBuild**: Fast bundling for production server builds

### Utility Libraries
- **Date-fns**: Date manipulation and formatting for appointment scheduling
- **React Hook Form**: Form state management with validation integration
- **TanStack React Query**: Server state synchronization and caching
- **Zod**: Runtime type validation and schema definition
- **Class Variance Authority**: Type-safe component variant styling
- **CLSX**: Conditional className utilities for dynamic styling

### Session and State Management
- **Connect-pg-simple**: PostgreSQL session store for Express sessions
- **React Router**: Client-side navigation with role-based route protection
- **Local Storage**: Client-side authentication state persistence