# Life Info Tracker - Setup Guide

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/life_info_tracker
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
npm start
# or for development
npm run dev
```

### 2. Frontend Setup

The frontend is static HTML files. You can:

**Option A: Local Development**
- Simply open `frontend/index.html` in a browser
- Update `frontend/config.js` with your backend URL

**Option B: Deploy to Netlify/Vercel**
- Connect your GitHub repo
- Set build command: (none needed for static files)
- Publish directory: `frontend`
- Update `frontend/config.js` with production backend URL

### 3. Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 mongo
```

**Option B: MongoDB Atlas**
- Create free cluster at mongodb.com/atlas
- Get connection string
- Update `MONGODB_URI` in `.env`

**Option C: Railway MongoDB**
- Add MongoDB service in Railway
- Use provided connection string

## 📋 Features

✅ Multi-user registration with DOB
✅ Automatic Life Path Number calculation
✅ Personalized astrological profile
✅ Dynamic dashboard generation
✅ JWT authentication
✅ AI integration ready
✅ All 15+ life tracking pages

## 🔑 API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/blueprint` - Get user blueprint (protected)
- `POST /api/blueprint/regenerate` - Regenerate blueprint (protected)

## 🎯 How It Works

1. User visits landing page (`index.html`)
2. User registers with DOB, email, password
3. System calculates:
   - Life Path Number (from DOB)
   - Birth Number (from day)
   - Zodiac Sign
   - Planetary Ruler
   - Archetype
4. Blueprint is generated and saved
5. User accesses personalized dashboard

## 📝 Next Steps

1. Copy page templates from YOGESH_LIFE_BLUEPRINT
2. Make pages dynamic (load user-specific data)
3. Integrate AI services (OpenAI/Claude)
4. Add daily logging functionality
5. Deploy backend to Railway
6. Deploy frontend to Netlify

