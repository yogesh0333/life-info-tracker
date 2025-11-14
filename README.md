# Life Info Tracker

A multi-user, AI-powered life tracking application that generates personalized life blueprints based on date of birth and astrological calculations.

## 🎯 Features

- **Multi-User Support**: Each user gets their own personalized dashboard
- **Astrological Alignment**: Automatic calculation of Life Path Number, Birth Number, and planetary influences
- **Personalized Blueprint**: Generate complete life tracking system based on birth chart
- **15+ Comprehensive Pages**: Career, Lifestyle, Health, Family, Finance, Spiritual, Remedies, Vastu, and more
- **AI Integration**: OpenAI & Claude for daily guidance and recommendations
- **Data Persistence**: MongoDB for secure data storage

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and API keys
npm start
```

### Frontend Setup

The frontend is static HTML files. Simply open `frontend/index.html` in a browser or deploy to Netlify/Vercel.

## 📁 Project Structure

```
life-info-tracker/
├── frontend/
│   ├── index.html          # Landing page
│   ├── register.html       # Registration page
│   └── dashboard.html      # User dashboard (to be generated)
├── backend/
│   ├── server.js           # Main server file
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions (astrology calculations)
│   └── config/             # Configuration files
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Blueprint
- `GET /api/blueprint` - Get user's blueprint (protected)
- `POST /api/blueprint/regenerate` - Regenerate blueprint (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

## 🌟 How It Works

1. User visits landing page and learns about the app
2. User registers with DOB, email, password
3. System calculates Life Path Number and astrological profile
4. Personalized blueprint is generated
5. User accesses their dashboard with all life tracking pages

## 📝 Environment Variables

See `backend/.env.example` for required environment variables.

## 🎨 Astrological Calculations

The system automatically calculates:
- **Life Path Number** (1-9) from date of birth
- **Birth Date Number** from day of birth
- **Zodiac Sign** from date
- **Planetary Ruler** based on Life Path
- **Archetype** (e.g., "Sovereign Magician" for Life Path 3)

## 📄 License

MIT

