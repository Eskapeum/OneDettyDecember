# OneDettyDecember

> Your December in Lagos & Accra - Events, Stays, Experiences & More

## 🎯 Project Overview

OneDettyDecember is a comprehensive marketplace platform connecting travelers with unforgettable December experiences in Lagos and Accra. Book events, accommodations, experiences, car rentals, and more - all in one place.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** Supabase Auth
- **Payment:** Stripe & Paystack
- **UI Components:** Custom components with Flowbite base
- **State Management:** Zustand
- **Form Validation:** React Hook Form + Zod

## 📦 Project Structure

```
onedettydecember/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ui/            # Base UI components
│   │   ├── layout/        # Layout components
│   │   ├── navigation/    # Navigation components
│   │   ├── feedback/      # Toasts, alerts, etc.
│   │   └── data-display/  # Tables, cards, etc.
│   ├── lib/               # Utility libraries
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript type definitions
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static assets
```

## 🎨 Vertical Themes

The platform supports 6 marketplace verticals with unique color themes:

- **Stays** - Coastal Emerald (#2A9D8F)
- **Events** - Afrobeat Red (#E63946)
- **Experiences** - Festival Orange (#FB8500)
- **Cars** - Atlantic Blue (#003566)
- **Marketplace** - Highlife Purple (#7209B7)
- **Community** - Danfo Yellow (#FFD60A)

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Supabase account
- Stripe account (test mode)
- Paystack account (test mode)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/OneDettyDecember.git
cd OneDettyDecember
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your actual credentials
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run database migrations (when available):
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook (coming soon)
- `npx prisma studio` - Open Prisma Studio

## 🗄️ Database Schema

The database includes the following main entities:

- **Users** - Travelers, Vendors, Admins
- **Vendors** - Business profiles for package creators
- **Packages** - Events, Stays, Experiences, Car Rentals, Marketplace Products
- **Bookings** - User reservations
- **Payments** - Transaction records
- **Reviews** - User feedback
- **Wishlist** - Saved packages
- **Waitlist** - Pre-launch signups

## 🔐 Environment Variables

See `.env.example` for required environment variables. Key variables include:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `PAYSTACK_SECRET_KEY` - Paystack secret key

## 📱 Features

### Phase 1 - MVP (Current Sprint)
- [ ] Landing page with waitlist
- [ ] User authentication (Supabase)
- [ ] Package browsing and search
- [ ] Booking flow
- [ ] Payment integration (Stripe/Paystack)
- [ ] Basic vendor dashboard

### Phase 2 - Enhanced Features
- [ ] AI-powered itinerary planner
- [ ] Group booking capabilities
- [ ] Advanced search and filters
- [ ] Reviews and ratings
- [ ] Wishlist functionality

### Phase 3 - Advanced Features
- [ ] Mobile app (React Native)
- [ ] Vendor analytics dashboard
- [ ] Referral program
- [ ] Multi-currency support
- [ ] Real-time notifications

## 👥 Team

- **Dev 1 (Amelia)** - Lead Developer & Project Setup
- **Dev 2 (Neriah)** - Frontend & Component Library
- **Dev 3 (Nesiah)** - Backend & API Development
- **Dev 4 (Neziah)** - Authentication & Payments
- **Dev 5 (Daniel)** - Testing & DevOps

## 📅 Development Timeline

- **Sprint 0** - Foundation Setup (Nov 17-18, 2025)
- **Sprint 1** - Core Features (Nov 19-25, 2025)
- **Sprint 2** - Integration & Testing (Nov 26-Dec 2, 2025)
- **Sprint 3** - Polish & Launch Prep (Dec 3-9, 2025)
- **Launch** - December 2025

## 📄 License

Private - All Rights Reserved

## 🤝 Contributing

This is a private project. If you're part of the team, please follow the Git workflow:

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request
5. Wait for code review

---

**Built with ❤️ for the Detty December community**
