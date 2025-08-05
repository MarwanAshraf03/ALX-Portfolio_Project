# Auction Platform Frontend

A React-based frontend for the auction platform built with Vite, TypeScript, and Tailwind CSS.

## Features

- User authentication (signup/login/logout)
- Browse auctions
- Place bids on items
- Admin panel for creating and updating auctions
- Responsive design with Tailwind CSS
- Form handling with React Hook Form
- Toast notifications

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Backend Configuration

Make sure to update the API base URL in `src/services/api.ts` to match your backend server:

```typescript
const API_BASE_URL = 'http://localhost:3000'; // Update this to your backend URL
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/ui/     # Reusable UI components
├── pages/            # Page components
├── services/         # API services
├── hooks/           # Custom hooks
├── lib/             # Utility functions
└── App.tsx          # Main app component
```

## API Integration

The frontend integrates with the following backend endpoints:

### User Authentication
- `POST /sign_in` - User registration
- `POST /log_in` - User login
- `POST /log_out` - User logout

### Auction Management
- `POST /create_auction` - Create new auction (admin)
- `POST /update_auction` - Update auction (admin)
- `GET /auction_list` - Get list of auctions
- `POST /bid` - Place bid on auction

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Tanstack Query** - Data fetching
- **Radix UI** - Accessible components
- **Sonner** - Toast notifications