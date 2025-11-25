# Canteen Connect

A modern campus food ordering platform built with React (Vite) and NestJS.

## Features

-  Browse menus from multiple campus outlets
-  Cart management with real-time updates
-  Integrated payments via Razorpay (COD & Prepaid)
-  Admin dashboard for outlet management
-  Vendor dashboard for order management
-  Responsive design for mobile and desktop
-  Real-time order status updates via WebSocket
-  Review and rating system
-  Coupon and discount support

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Material-UI (MUI) for components
- TanStack Query for data fetching
- Zustand for state management
- Framer Motion for animations
- Socket.io for real-time updates

### Backend
- NestJS with TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication
- Razorpay payment integration
- Cloudinary for image uploads
- WebSocket support

## Project Structure

```
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── api/       # API client and endpoints
│   │   ├── components/# Reusable UI components
│   │   ├── features/  # Feature-specific components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── pages/     # Page components
│   │   └── store/     # Zustand state stores
│   └── ...
├── backend/            # NestJS backend application
│   ├── src/
│   │   ├── auth/      # Authentication module
│   │   ├── menu/      # Menu management
│   │   ├── orders/    # Order processing
│   │   ├── outlets/   # Outlet management
│   │   ├── prisma/    # Database module
│   │   └── ...
│   └── prisma/        # Database schema and migrations
└── vercel.json        # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database (or use a cloud database like Neon, Supabase, Railway)
- Razorpay account (for payments)
- Cloudinary account (for image uploads)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/asapabhii/CanteenConnectFinal.git
   cd CanteenConnectFinal
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all project dependencies
   npm run install:all
   ```

3. **Set up the backend environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database URL and other credentials
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed  # Optional: seed with sample data
   cd ..
   ```

5. **Start development servers**
   ```bash
   # Start them in separate terminal windows:
   npm run dev:backend  # Backend on http://localhost:3000
   npm run dev:frontend # Frontend on http://localhost:5173
   ```



## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Support

For issues and feature requests, please open a GitHub issue.
