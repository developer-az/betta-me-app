# Betta Me - Fish Care App

A React application for managing betta fish care with user authentication and data persistence using Supabase.

## Features

- 🔐 User authentication (signup, login, logout)
- 🐠 Fish health tracking
- 🏠 Tank management
- 💧 Water quality monitoring
- 📊 Dashboard with overview
- 🔒 Row Level Security (RLS) for data protection
- 📱 Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router DOM
- **State Management**: React Context + Supabase real-time

## Quick Start

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > API to get your project URL and anon key
4. Copy the SQL from `supabase-schema.sql` and run it in the Supabase SQL editor

### 2. Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url_here
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Database Schema

The app uses the following tables:

- **profiles**: User profile information
- **tanks**: Tank configuration and settings
- **fish**: Fish health and condition data
- **water_readings**: Water quality measurements

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data.

## Authentication Flow

1. Users can sign up with email/password
2. Email confirmation is required (configured in Supabase)
3. Users can sign in and access protected routes
4. Session persistence across browser sessions
5. Automatic logout on session expiry

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   └── Navigation.tsx  # Main navigation
├── contexts/
│   └── AuthContext.tsx # Authentication context
├── lib/
│   └── supabase.ts     # Supabase client configuration
├── pages/              # Page components
└── types.ts           # TypeScript type definitions
```

## Security Features

- Row Level Security (RLS) on all database tables
- Password hashing handled by Supabase Auth
- Protected routes requiring authentication
- Automatic session management
- CSRF protection via Supabase

## Deployment

The app can be deployed to any static hosting service:

1. Build the app: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Ensure environment variables are set in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
