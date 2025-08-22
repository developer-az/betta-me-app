# Betta Me - Fish Care App

Betta Me is a React TypeScript application for managing betta fish care with user authentication and data persistence using Supabase. The app helps users track their betta fish health, tank conditions, and water quality through an intuitive web interface.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Initial Setup and Dependencies
- Install dependencies:
  - `npm install` -- takes 45-80 seconds (varies by system). NEVER CANCEL. Set timeout to 120+ seconds.
  - Creates `node_modules` with 1362+ packages
  - Shows deprecation warnings but installs successfully

### Environment Configuration
- **CRITICAL**: Set up environment variables before building or running:
  - Copy environment template: `cp env.example .env.local`
  - Update `.env.local` with real Supabase credentials:
    ```env
    REACT_APP_SUPABASE_URL=https://apesehqjztvperbrywax.supabase.co
    REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
    ```
  - **Note**: The app will fail to start without proper environment variables

### Build Commands
- **Development build and run**:
  - `npm start` -- starts development server instantly, opens http://localhost:3000
  - Development server shows 1 ESLint warning but runs successfully
  - Hot reloading enabled, changes reflected immediately

- **Production build**:
  - `CI=false npm run build` -- takes 12-22 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
  - **CRITICAL**: Use `CI=false` to treat warnings as warnings, not errors
  - Creates optimized build in `build/` directory (148 kB main JS, 5.35 kB CSS)
  - Alternative: Set `GENERATE_SOURCEMAP=false` to reduce build size

### Testing
- `REACT_APP_SUPABASE_URL=https://apesehqjztvperbrywax.supabase.co REACT_APP_SUPABASE_ANON_KEY=test-key npm test -- --watchAll=false --verbose` -- takes 2.5 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- **CRITICAL**: Tests require environment variables to be set inline or app will fail to start
- 1 test passes (renders welcome headline)
- Tests show some React warnings but pass successfully

### Production Deployment Testing
- Install serve globally: `npm install -g serve` (takes 5 seconds)
- Serve production build: `serve -s build -p 3001`
- **CRITICAL**: Always test production build locally before deployment
- Test at: http://localhost:3001

## Validation

### Manual Testing Requirements
- **ALWAYS** validate core functionality after making changes:
  1. **Welcome Page**: Navigate to http://localhost:3000, verify page loads with betta fish imagery and "Betta Adventure" heading
  2. **Navigation**: Test all navigation buttons (Welcome, Tank, Fish, Water, Dashboard)
  3. **Protected Routes**: Click Tank/Fish/Water/Dashboard buttons, verify redirect to /login page (authentication required)
  4. **Authentication Flow**: Click "Sign Up" button, verify signup form loads at /signup route with email/password fields
  5. **Dark Mode**: Test dark/light mode toggle functionality in top-right corner
  6. **Production Build**: Build and serve production version, verify identical functionality at different port

### Expected User Scenarios
- **Authentication Protection**: All main app features (Tank, Fish, Water, Dashboard) require authentication
- **Complete User Journey**: Welcome → Sign Up → Email confirmation → Sign In → Navigate to tank setup → Add fish details → Record water readings → View dashboard
- **Responsive Design**: Test on different screen sizes (app uses Tailwind CSS with mobile-first approach)
- **Error Handling**: Test form validation, network errors, missing environment variables
- **Data Persistence**: Verify data saves to Supabase correctly with proper user isolation (RLS)

### Development Workflow
- Always run development server for testing changes: `npm start`
- **NEVER** commit with ESLint errors - fix the missing dependency warning in DataProvider.tsx
- Use browser DevTools to monitor console for Supabase connection logs
- **Expected console messages**:
  - "Supabase URL: Set"
  - "Supabase Anon Key: Set" 
  - "Supabase client initialized successfully"
  - React DevTools suggestion (info level)
  - Some deprecation warnings from webpack-dev-server (can be ignored)
- **Hot reloading**: Changes to source files automatically refresh the browser
- **Port conflicts**: If port 3000 is in use, React will offer to use port 3001

## Common Issues and Solutions

### Build Failures
- **"Missing Supabase environment variables"**: Set up `.env.local` file with correct values
- **"Treating warnings as errors"**: Use `CI=false npm run build` instead of plain `npm run build`
- **ESLint exhaustive-deps warning**: Add `// eslint-disable-next-line react-hooks/exhaustive-deps` to line 96 in DataProvider.tsx

### Test Failures
- **Missing environment variables in tests**: Always set environment variables inline when running tests
- **Supabase connection errors**: Tests use mock values, actual connection not required

### Development Server Issues
- **Port 3000 already in use**: Kill existing processes or use different port (React will suggest port 3001)
- **Hot reload not working**: Restart development server with Ctrl+C then `npm start`
- **Fonts not loading**: External Google Fonts may be blocked, but app functions normally
- **White screen/blank page**: Check browser console for JavaScript errors, verify environment variables

### Network and Environment Issues
- **Supabase connection failed**: Verify REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set correctly
- **CORS errors**: Update Supabase project settings to allow your domain
- **Build cache issues**: Clear with `rm -rf build node_modules package-lock.json && npm install`

## Repository Structure

### Key Directories and Files
```
├── .github/                 # GitHub configuration
├── public/                  # Static assets (favicon, manifest)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── DataProvider.tsx  # Data management component
│   │   ├── Navigation.tsx    # Main navigation
│   │   └── Layout.tsx       # Layout wrapper
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication context
│   ├── lib/
│   │   └── supabase.ts     # Supabase client configuration
│   ├── pages/              # Page components (Welcome, Tank, Fish, Water, Dashboard)
│   └── types.ts           # TypeScript type definitions
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

### Important Files to Monitor
- **src/lib/supabase.ts**: Database connection configuration
- **src/contexts/AuthContext.tsx**: Authentication state management  
- **src/components/DataProvider.tsx**: Data fetching and state (has known ESLint warning)
- **package.json**: Available scripts and dependencies
- **.env.local**: Environment variables (create from env.example)

## Available Scripts Reference

```bash
npm start        # Start development server (instant)
npm run build    # Build for production (12 seconds with CI=false)
npm test         # Run test suite (2.5 seconds)
npm run eject    # Eject from Create React App (IRREVERSIBLE)
```

## Technology Stack

- **Frontend**: React 19.1.0, TypeScript 4.9.5
- **Styling**: Tailwind CSS 3.4.14, Framer Motion 12.23.9
- **Backend**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth
- **Routing**: React Router DOM 6.26.2
- **Build Tool**: Create React App 5.0.1
- **Icons**: React Icons 5.5.0

## Deployment

The app can be deployed to any static hosting service (Vercel, Netlify, Cloudflare Pages):

1. **Build**: `CI=false npm run build`
2. **Deploy**: Upload `build/` directory
3. **Environment Variables**: Set production Supabase credentials
4. **Routing**: Configure SPA routing (/* → /index.html)

See `deployment-troubleshooting.md` for platform-specific deployment configurations.

## Database Setup

- **Schema**: Use `supabase-schema.sql` to set up database tables
- **Tables**: profiles, tanks, fish, water_readings (all with RLS enabled)
- **Setup Guide**: Follow `supabase-setup-checklist.md` for complete setup
- **Security**: Row Level Security configured for user data isolation