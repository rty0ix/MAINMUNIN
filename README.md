# RTYO - Officer Check-in System

A modern web application for managing officer check-ins and subpoena processing.

## Features

- Secure officer check-in system
- Administrative dashboard
- Real-time updates
- Role-based access control
- Responsive design

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Supabase
- Vite
- Zustand

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Supabase credentials
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Setup

Run the SQL commands in `supabase/schema.sql` in your Supabase SQL editor to set up the database schema.

## Deployment

The application is automatically deployed to Netlify when changes are pushed to the main branch.

## License

MIT