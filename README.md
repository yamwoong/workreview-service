# WorkReview Service - Authentication Template

A production-ready full-stack authentication system with modern UI design. Built with React, TypeScript, Express, and MongoDB.

> 🎯 **Use this as a template** for your next project! Click the "Use this template" button to get started.

## ✨ Features

### 🔐 Authentication System
- User registration with email verification
- Secure login/logout with JWT tokens
- Password reset via email
- Profile management
- Role-based access control (admin, manager, employee)

### 🎨 Modern UI Design
- Responsive design with TailwindCSS
- Aquamarine color scheme
- Consistent design system across all pages
- Error pages (404, 403, 500)
- Loading states and toast notifications

### 🛡️ Security Features
- bcrypt password hashing (salt rounds: 12)
- JWT token authentication (Access + Refresh tokens)
- Token blacklist for logout
- Rate limiting (brute force protection)
  - Login: 5 attempts per 5 minutes
  - Register: 3 attempts per hour
  - Password change: 3 attempts per 15 minutes
- CORS whitelist
- Helmet.js security headers
- Input validation with Zod

### 📧 Email Integration
- Password reset emails via Gmail SMTP
- 6-digit verification codes
- Customizable email templates

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Email**: Nodemailer
- **Security**: bcrypt, helmet, cors
- **Logging**: Winston

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Form Management**: React Hook Form
- **Validation**: Zod
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Router**: React Router v6
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **MongoDB** 5.0+ (local or Atlas)
- **Gmail account** (for email functionality)

## 🚀 Getting Started

### 1. Create a New Project from Template

#### Option A: Using GitHub Template (Recommended)
1. Click the **"Use this template"** button at the top of this repository
2. Enter your new repository name (e.g., `my-blog-app`)
3. Choose public or private
4. Click **"Create repository"**
5. Clone your new repository:
   ```bash
   git clone https://github.com/yourusername/my-blog-app.git
   cd my-blog-app
   ```

#### Option B: Manual Clone
```bash
git clone https://github.com/yourusername/workreview-service.git my-new-project
cd my-new-project
rm -rf .git
git init
git add .
git commit -m "Initial commit from workreview template"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
```

#### Backend Environment Variables

Create a `backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/your-project-name

# JWT Secrets (Generate new secrets!)
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-change-this-too
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Your App <noreply@yourapp.com>
```

#### Gmail App Password Setup

1. Go to your Google Account settings
2. Security → 2-Step Verification (enable if not enabled)
3. App passwords → Generate new app password
4. Copy the password to `EMAIL_PASSWORD` in `.env`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Frontend Environment Variables

Create a `frontend/.env` file:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Environment
VITE_ENV=development
```

### 4. Database Setup

Make sure MongoDB is running:

```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas connection string in DATABASE_URL
```

The database will be automatically created when you start the backend server.

### 5. Run the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📁 Project Structure

```
workreview-service/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   ├── validators/      # Zod schemas
│   │   ├── app.ts           # Express app
│   │   └── server.ts        # Server entry point
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/             # API clients
│   │   ├── app/             # App component
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Libraries
│   │   ├── pages/           # Page components
│   │   ├── stores/          # Zustand stores
│   │   ├── styles/          # Global styles
│   │   ├── types/           # TypeScript types
│   │   ├── validators/      # Zod schemas
│   │   └── main.tsx         # Entry point
│   ├── .env                 # Environment variables
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── docs/                    # Documentation
└── README.md
```

## 🔧 Available Scripts

### Backend Scripts
```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm start          # Start production server
npm test           # Run tests
```

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🎯 Customization Guide

After creating a project from this template, customize it for your needs:

### 1. Update Project Information

**backend/package.json**
```json
{
  "name": "your-project-backend",
  "description": "Your project description"
}
```

**frontend/package.json**
```json
{
  "name": "your-project-frontend",
  "description": "Your project description"
}
```

### 2. Update Branding

Search and replace "WorkReview" with your app name in:
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/pages/auth/*.tsx`
- Email templates in `backend/src/utils/email.util.ts`

### 3. Modify User Model (if needed)

Add custom fields in `backend/src/models/User.model.ts`:
```typescript
// Example: Add phone number
phone: {
  type: String,
  trim: true,
}
```

### 4. Add Your Features

This template provides the authentication foundation. Build on top of it:
- Add your business models (Posts, Products, etc.)
- Create new API routes
- Add corresponding frontend pages
- Implement your business logic

## 🔐 Security Considerations

### Production Checklist

Before deploying to production:

- [ ] Change all JWT secrets to strong, random values
- [ ] Use environment-specific `.env` files
- [ ] Enable HTTPS
- [ ] Update CORS settings for production domain
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or managed database
- [ ] Configure proper email service (not personal Gmail)
- [ ] Review and adjust rate limiting values
- [ ] Enable MongoDB authentication
- [ ] Set up proper logging and monitoring
- [ ] Add database backups
- [ ] Consider adding 2FA for sensitive operations

### Generate Strong Secrets

```bash
# Generate random secrets for JWT
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🧪 Testing

### Test User Registration
1. Navigate to `/register`
2. Fill in the form
3. Check for success message
4. Verify automatic login

### Test Password Reset
1. Navigate to `/forgot-password`
2. Enter email address
3. Check email for reset code
4. Click reset link
5. Set new password
6. Login with new password

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register              - Register new user
POST   /api/auth/login                 - Login user
POST   /api/auth/logout                - Logout user (requires auth)
POST   /api/auth/refresh               - Refresh access token
GET    /api/auth/me                    - Get current user (requires auth)
PATCH  /api/auth/me                    - Update profile (requires auth)
PUT    /api/auth/me/password           - Change password (requires auth)
POST   /api/auth/forgot-password       - Request password reset
GET    /api/auth/verify-reset-token/:token - Verify reset token
POST   /api/auth/reset-password/:token - Reset password
```

## 🤝 Contributing

This is a template repository. Feel free to:
- Use it for your projects
- Modify it to fit your needs
- Share improvements via pull requests

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with:
- React, Express, MongoDB, TypeScript
- TailwindCSS for styling
- Various open-source libraries

---

## 💡 Example Projects Built with This Template

Add your projects here after building them!

- **Blog Platform** - Personal blogging with markdown support
- **Task Manager** - Kanban-style project management
- **Social App** - Mini social network with posts and comments

---

**Ready to build something amazing? Click "Use this template" and get started! 🚀**

---

## 📞 Support

If you have questions or need help:
- Open an issue on GitHub
- Check the documentation in `/docs`
- Review the code comments

---

<div align="center">
  <strong>🤖 Generated with Claude Code</strong>
  <br>
  <em>Production-ready authentication template for modern web applications</em>
</div>
