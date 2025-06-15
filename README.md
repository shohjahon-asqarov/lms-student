# Quiz LMS Dashboard

A modern Learning Management System (LMS) dashboard built with React, TypeScript, and Vite for managing and taking quizzes.

## 🚀 Tech Stack

- **Frontend**: React 18.3.1, TypeScript 5.5.3
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: TanStack Query (React Query) 5.56.2
- **HTTP Client**: Axios 1.7.7
- **Routing**: React Router DOM 6.26.2
- **Icons**: Lucide React 0.344.0
- **Forms**: React Hook Form 7.53.0
- **Charts**: Recharts 2.12.7
- **Authentication**: JWT Decode 4.0.0

## 📋 Prerequisites

- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **npm**: Version 9.0.0 or higher
- **Git**: For version control

### Node.js Version Check

```bash
node --version
# Should be >= 18.0.0

npm --version
# Should be >= 9.0.0
```

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd quiz-lms-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp env.example .env

# Edit the environment variables
nano .env
```

### 4. Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# ========================================
# API Configuration
# ========================================
VITE_API_BASE_URL=https://api.lms.itechacademy.uz/api
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3

# ========================================
# Authentication Configuration
# ========================================
VITE_AUTH_TOKEN_KEY=auth_token
VITE_USER_DATA_KEY=user_data
VITE_TOKEN_EXPIRY_BUFFER=300

# ========================================
# App Configuration
# ========================================
VITE_APP_NAME=Quiz LMS Dashboard
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Learning Management System for Quizzes
VITE_APP_AUTHOR=ITech Academy

# ========================================
# Query Client Configuration
# ========================================
VITE_QUERY_RETRY_COUNT=1
VITE_QUERY_STALE_TIME=300000
VITE_QUERY_REFETCH_ON_FOCUS=false
VITE_QUERY_REFETCH_ON_WINDOW_FOCUS=false
VITE_QUERY_REFETCH_ON_RECONNECT=true

# ========================================
# Quiz Configuration
# ========================================
VITE_DEFAULT_QUIZ_DURATION=30
VITE_DEFAULT_QUIZ_DIFFICULTY=medium
VITE_DEFAULT_QUIZ_CATEGORY=General
VITE_MAX_QUIZ_QUESTIONS=100
VITE_MIN_QUIZ_QUESTIONS=1
VITE_QUIZ_AUTO_SUBMIT=true

# ========================================
# Pagination Configuration
# ========================================
VITE_DEFAULT_PAGE_SIZE=10
VITE_MAX_PAGE_SIZE=100
VITE_SHOW_SIZE_CHANGER=true
VITE_SHOW_QUICK_JUMPER=true

# ========================================
# Development Configuration
# ========================================
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
VITE_ENABLE_DEBUG_MODE=false
VITE_MOCK_API=false
VITE_SHOW_PERFORMANCE_METRICS=false
```

## 🚀 Development Commands

### Start Development Server

```bash
npm run dev
```

- Starts the development server on `http://localhost:5173`
- Hot module replacement enabled
- Auto-reload on file changes

### Build for Production

```bash
npm run build
```

- Creates optimized production build in `dist/` folder
- Minifies and bundles all assets
- Generates source maps for debugging

### Preview Production Build

```bash
npm run preview
```

- Serves the production build locally
- Useful for testing before deployment
- Runs on `http://localhost:4173`

### Lint Code

```bash
npm run lint
```

- Runs ESLint to check code quality
- Identifies potential issues and enforces coding standards

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components
│   ├── Pagination.tsx  # Pagination component
│   └── ProtectedRoute.tsx
├── config/             # Configuration files
│   ├── api.ts         # API configuration
│   ├── auth.ts        # Authentication configuration
│   ├── app.ts         # App configuration
│   ├── query.ts       # Query client configuration
│   ├── quiz.ts        # Quiz configuration
│   ├── pagination.ts  # Pagination configuration
│   ├── dev.ts         # Development configuration
│   └── env.ts         # Main environment configuration
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx    # Authentication hook
│   └── useQueries.ts  # API query hooks
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Quizzes.tsx
│   ├── TakeQuiz.tsx
│   ├── Results.tsx
│   ├── Profile.tsx
│   └── Settings.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── api.ts         # API service
├── App.tsx             # Main app component
└── main.tsx           # App entry point
```

## 🔧 Configuration Files

### Environment Configuration

The project uses a modular configuration system:

- **`src/config/api.ts`** - API endpoints and settings
- **`src/config/auth.ts`** - Authentication settings
- **`src/config/app.ts`** - Application metadata
- **`src/config/query.ts`** - React Query settings
- **`src/config/quiz.ts`** - Quiz-related settings
- **`src/config/pagination.ts`** - Pagination settings
- **`src/config/dev.ts`** - Development settings

### Import Configuration

```typescript
// Import specific config
import { apiConfig } from "../config/env";

// Import all configs
import { config } from "../config/env";
```

## 🏗️ Build Process

### Development Build

```bash
npm run dev
```

- Uses Vite dev server
- Fast hot module replacement
- Source maps for debugging

### Production Build

```bash
npm run build
```

- Optimizes and minifies code
- Tree-shaking removes unused code
- Generates static assets
- Creates `dist/` folder with production files

### Build Output

```
dist/
├── index.html          # Main HTML file
├── assets/             # Compiled assets
│   ├── index-*.js      # Main JavaScript bundle
│   ├── index-*.css     # Compiled CSS
│   └── *.png           # Optimized images
└── vite.svg            # Static assets
```

## 🚀 Deployment

### Static Hosting (Netlify, Vercel, etc.)

```bash
# Build the project
npm run build

# Deploy the dist/ folder
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔍 API Integration

### Base URL Configuration

```typescript
// src/config/api.ts
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000"),
  retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || "3"),
};
```

### Authentication

- JWT token-based authentication
- Automatic token refresh
- Secure localStorage usage
- Automatic logout on token expiry

### API Endpoints

- `GET /api/quiz` - Get quizzes list
- `GET /api/quiz/{id}/start` - Start quiz
- `POST /api/quiz/finish` - Submit quiz
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile

## 🧪 Testing

### Run Tests (if configured)

```bash
npm test
```

### Type Checking

```bash
npx tsc --noEmit
```

## 📊 Performance

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Analyze bundle size
npm run build
# Check dist/stats.html for bundle analysis
```

### Optimization Features

- Code splitting with dynamic imports
- Tree shaking for unused code removal
- Asset optimization and compression
- Lazy loading for routes
- Memoization for expensive computations

## 🔒 Security

### Environment Variables

- All sensitive data in environment variables
- No hardcoded secrets in source code
- Environment-specific configurations

### Authentication

- JWT token validation
- Automatic token refresh
- Secure token storage
- CSRF protection

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

#### Node Version Issues

```bash
# Use nvm to switch Node versions
nvm use 18
```

#### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Loading

```bash
# Ensure .env file exists
ls -la .env

# Check variable names start with VITE_
grep VITE_ .env
```

## 📝 Scripts Reference

| Script               | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start development server     |
| `npm run build`      | Build for production         |
| `npm run preview`    | Preview production build     |
| `npm run lint`       | Run ESLint                   |
| `npm run type-check` | Run TypeScript type checking |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ by ITech Academy**
