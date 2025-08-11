# SweetStreaks - Sugar-Free Tracking App

A modern, mobile-first web application for tracking sugar-free streaks, challenges, and achievements. Built with Next.js 14, Supabase authentication, and a premium design system.

## Features

- 🍃 **Daily Streak Tracking** - Track your sugar-free journey with 24-hour check-in windows
- 🛡️ **Streak Shields** - Protect your streak with limited monthly shields (3 per month)
- 🎯 **Challenges** - Take on specific challenges like "10 Days No Fast Food"
- 🏆 **Milestones & Achievements** - Celebrate your progress with milestone rewards
- 📊 **Analytics** - Detailed analytics with quality scoring and consistency tracking
- 🤝 **Social Sharing** - Share your achievements on social media
- 🔐 **Secure Authentication** - Powered by Supabase auth
- 📱 **Mobile-First Design** - Optimized for mobile with touch-friendly interactions
- 🎨 **Premium UI** - Glassmorphism effects, smooth animations, and premium design

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Radix UI primitives
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd sweetstreaks-nextjs
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your keys
3. Copy `.env.local.example` to `.env.local`
4. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Authentication

Supabase Auth is automatically configured. The app supports:
- Email/password authentication
- Email confirmation (configurable)
- Automatic session management

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (splash/onboarding)
│   ├── login/page.tsx     # Login page
│   ├── signup/page.tsx    # Signup page
│   └── dashboard/page.tsx # Main dashboard
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── [features]/       # Feature-specific components
├── lib/                  # Utilities and configuration
│   ├── supabaseClient.ts # Supabase client setup
│   └── AppContext.tsx    # Global app state management
├── styles/
│   └── globals.css       # Global styles and design system
├── middleware.ts         # Route protection
└── public/              # Static assets
```

## Key Features & Components

### Authentication Flow
- **Splash Screen** → **Onboarding** → **Sign Up/Login** → **Dashboard**
- Protected routes with automatic redirects
- Session persistence with Supabase

### Dashboard Sections
- **Dashboard**: Main streak tracking and daily check-ins
- **Challenges**: Custom challenges with reset logic
- **Milestones**: Achievement tracking and rewards
- **Analytics**: Detailed streak analytics and insights
- **Share**: Social media sharing with custom cards
- **Settings**: Profile management and streak shields

### Streak Management
- 24-hour check-in windows with 2-hour grace periods
- Streak shields (3 per month, 7-day cooldown)
- Quality scoring based on consistency
- Timezone support for global users

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Deploy to Other Platforms

The app is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- DigitalOcean App Platform
- Any platform supporting Node.js

Build the app:
```bash
npm run build
npm start
```

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript check
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is private and proprietary. All rights reserved.

## Support

For support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using Next.js 14, Supabase, and modern web technologies.**