# Canteen Connect

A modern campus food ordering platform built with React (Vite) and NestJS.

## Features

- 🍔 Browse menus from multiple campus outlets
- 🛒 Cart management with real-time updates
- 💳 Integrated payments via Razorpay (COD & Prepaid)
- 📊 Admin dashboard for outlet management
- 👨‍🍳 Vendor dashboard for order management
- 📱 Responsive design for mobile and desktop
- 🔔 Real-time order status updates via WebSocket
- ⭐ Review and rating system
- 🎫 Coupon and discount support

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
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately:
   npm run dev:backend  # Backend on http://localhost:3000
   npm run dev:frontend # Frontend on http://localhost:5173
   ```

## Vercel Deployment

### Quick Deploy

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   
   Add these environment variables in Vercel's project settings:
   
   | Variable | Description |
   |----------|-------------|
   | `DATABASE_URL` | PostgreSQL connection string |
   | `JWT_SECRET` | Secret key for JWT tokens |
   | `FRONTEND_URL` | Your Vercel deployment URL |
   | `RAZORPAY_KEY_ID` | Razorpay Key ID |
   | `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
   | `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
   | `CLOUDINARY_API_KEY` | Cloudinary API key |
   | `CLOUDINARY_API_SECRET` | Cloudinary API secret |
   | `NODE_ENV` | Set to `production` |

4. **Deploy**
   - Vercel will automatically build and deploy your application
   - The frontend will be served at your Vercel URL
   - API endpoints will be available at `/api/*`

### Database Setup

You can use any PostgreSQL provider:

- **[Neon](https://neon.tech)** - Serverless PostgreSQL (recommended for Vercel)
- **[Supabase](https://supabase.com)** - PostgreSQL with additional features
- **[Railway](https://railway.app)** - Simple database hosting
- **[PlanetScale](https://planetscale.com)** - MySQL-compatible (requires schema changes)

### After Deployment

1. **Run migrations**
   ```bash
   # Connect to your production database and run migrations
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   ```

2. **Seed initial data** (optional)
   ```bash
   DATABASE_URL="your-production-url" npx prisma db seed
   ```

## Environment Variables

### Backend (`.env`)

```env
DATABASE_URL="postgresql://user:password@host:5432/canteen"
JWT_SECRET="your-secure-jwt-secret"
FRONTEND_URL="https://your-app.vercel.app"
RAZORPAY_KEY_ID="your_razorpay_key"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NODE_ENV="production"
```

### Frontend (`.env`)

```env
VITE_API_URL=  # Leave empty for Vercel (uses /api path)
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build both frontend and backend |
| `npm run dev` | Start both servers in development |
| `npm run dev:frontend` | Start frontend dev server |
| `npm run dev:backend` | Start backend dev server |
| `npm run lint` | Run linters for both projects |
| `npm run test` | Run backend tests |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:outletId` - Get menu for outlet

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `PATCH /api/orders/:id/status` - Update order status

### Outlets
- `GET /api/outlets` - Get all outlets
- `GET /api/outlets/:id` - Get outlet details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and feature requests, please open a GitHub issue.
