# 🤖 AI-Powered Blueprint Generation System

## ✅ What Changed

**BEFORE:** Pages had hardcoded content copied from YOGESH_LIFE_BLUEPRINT  
**NOW:** All content is **AI-generated** based on each user's unique astrological profile

---

## 🔄 How It Works

### 1. User Registration
- User enters DOB, TOB, POB
- Backend calculates astrological profile (Life Path, Planetary Ruler, Archetype)
- User account created

### 2. AI Content Generation
- **Automatic (Async):** After registration, AI generates content for all pages in background
- **On-Demand:** When user visits a page, if content not ready, it generates on-the-fly
- **Stored:** All AI-generated content saved in database

### 3. Content Display
- Frontend loads AI-generated content from API
- Displays personalized recommendations
- Falls back to static content if AI fails

---

## 📋 AI-Generated Pages

Each page gets **personalized content** based on user's:
- Life Path Number
- Planetary Ruler
- Archetype
- Core Vibration
- Zodiac Sign
- Age & Gender

### Pages Generated:

1. **Career** - Career paths, skills, timeline, salary projection
2. **Lifestyle** - Brands, fragrances, clothing, colors (aligned with archetype)
3. **Health** - Meal plans, exercises, supplements, health predictions
4. **Family** - Conception plans, children timeline, remedies
5. **Finance** - Investment strategy, income trajectory, milestones
6. **Spiritual** - Deity worship, mantras, gemstones, practices
7. **Remedies** - Dasha remedies, life area remedies, daan schedule
8. **Vastu** - Home recommendations, directions, colors
9. **Medical Astrology** - Health predictions, test schedules
10. **Pilgrimage** - Temple recommendations, roadmap, budget

---

## 🤖 AI Providers

- **OpenAI** (GPT-3.5-turbo / GPT-4)
- **Claude** (Claude 3 Sonnet)
- **Auto-fallback:** If one fails, tries the other

**Environment Variables:**
- `OPENAI_API_KEY` - Your OpenAI API key
- `CLAUDE_API_KEY` - Your Claude API key
- `DEFAULT_AI_PROVIDER` - "openai" or "claude" (default: "openai")

---

## 🔌 API Endpoints

### Get Blueprint (All Content)
```
GET /api/blueprint
Returns: All AI-generated content for user
```

### Get Specific Page Content
```
GET /api/blueprint/page/:pageName
Examples:
- /api/blueprint/page/career
- /api/blueprint/page/lifestyle
- /api/blueprint/page/health
```

### Regenerate Blueprint
```
POST /api/blueprint/regenerate
Regenerates all content with AI
```

### Ask AI Assistant
```
POST /api/ai/ask
Body: { "question": "Your question", "provider": "openai" }
Returns: Personalized AI response
```

### Daily Guidance
```
GET /api/ai/daily-guidance
Returns: Daily personalized guidance
```

---

## 📝 Content Format

AI generates content in **structured JSON** format:

```json
{
  "careerPaths": [...],
  "timeline": {...},
  "skills": [...],
  "actionPlan": {...},
  "salaryProjection": {...}
}
```

If JSON parsing fails, content is returned as **formatted text**.

---

## 🎯 Key Features

✅ **100% Personalized** - Every user gets unique content  
✅ **Astrologically Aligned** - Based on Life Path, Planetary Ruler, Archetype  
✅ **AI-Powered** - Uses OpenAI/Claude for generation  
✅ **Cached** - Content stored in database, fast loading  
✅ **On-Demand** - Generates if not exists  
✅ **Fallback** - Static content if AI fails  

---

## 🚀 After Deployment

1. **User registers** → Astrological profile calculated
2. **AI generates** → Personalized content for all pages (async)
3. **User visits page** → Loads AI-generated content
4. **Content displayed** → Fully personalized recommendations

---

## ⚙️ Configuration

Make sure these are set in Railway:
- `OPENAI_API_KEY` ✅
- `CLAUDE_API_KEY` ✅
- `DEFAULT_AI_PROVIDER` (optional, defaults to "openai")
- `MONGODB_URI` ✅

---

**All content is now AI-generated, not copied! Each user gets their own personalized blueprint! 🎉**

