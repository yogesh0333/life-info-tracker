# 🗄️ Database Architecture - Life Info Tracker

## Overview

The database is built using **MongoDB** with **Mongoose ODM** for robust, scalable data management. The architecture includes multiple models, indexes, connection pooling, and comprehensive error handling.

---

## 📊 Database Models

### 1. **User Model** (`User.js`)
- **Purpose**: Store user accounts and astrological profiles
- **Key Fields**:
  - `name`, `email`, `password` (hashed)
  - `dob`, `tob`, `pob` (date/time/place of birth)
  - `astrology` (life path, planetary ruler, zodiac, etc.)
  - `blueprint` (AI-generated content Map)
- **Indexes**:
  - `email` (unique)
  - `astrology.lifePath`
  - `blueprint.generated`
  - `createdAt`, `lastLogin`

### 2. **DailyLog Model** (`DailyLog.js`)
- **Purpose**: Track daily activities and metrics
- **Key Fields**:
  - `user`, `date`, `category`
  - `activity`, `description`, `duration`
  - `mood`, `energy` (1-10 scale)
  - `tags`, `metrics` (flexible Map)
- **Indexes**:
  - `user + date` (compound)
  - `user + category + date` (compound)
  - `user + date + activity` (for deduplication)

### 3. **Goal Model** (`Goal.js`)
- **Purpose**: Track life goals with milestones
- **Key Fields**:
  - `user`, `category`, `title`
  - `targetValue`, `currentValue`, `unit`
  - `deadline`, `priority`, `status`
  - `milestones[]`, `progress` (auto-calculated)
- **Indexes**:
  - `user + status`
  - `user + category + status`
  - `user + deadline`
  - `user + priority + status`

### 4. **AIAssistantLog Model** (`AIAssistantLog.js`)
- **Purpose**: Store AI interaction history
- **Key Fields**:
  - `user`, `question`, `response`
  - `provider`, `model`, `tokens`
  - `context` (Map), `rating`, `feedback`
- **Indexes**:
  - `user + createdAt`
  - `provider + createdAt`
  - `user + rating`

---

## 🔧 Database Configuration

### Connection Settings (`config/database.js`)

**Features**:
- ✅ **Retry Logic**: 5 attempts with exponential backoff
- ✅ **Connection Pooling**: Min 2, Max 10 connections
- ✅ **Health Monitoring**: Heartbeat every 10 seconds
- ✅ **Auto-reconnect**: Handles disconnections gracefully
- ✅ **Graceful Shutdown**: Closes connections on SIGINT

**Connection Options**:
```javascript
{
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
  bufferMaxEntries: 0,
  bufferCommands: false,
  heartbeatFrequencyMS: 10000
}
```

### Health Check Endpoint

**GET `/health`**
- Returns database connection status
- Includes database statistics
- Used for monitoring and load balancers

---

## 🛡️ Data Validation

### Validation Middleware (`middleware/validate.js`)

**Functions**:
- `validateEmail()` - Email format validation
- `validateDate()` - Date format (YYYY-MM-DD)
- `validateTime()` - Time format (HH:MM)
- `validateRegister()` - Registration input validation
- `validateLogin()` - Login input validation
- `validateDailyLog()` - Daily log validation
- `validateGoal()` - Goal validation

**Sanitization**:
- All inputs are trimmed and sanitized
- String length limits (10k chars max)
- Email normalization (lowercase)
- Type conversion and validation

---

## 🛠️ Database Utilities (`utils/dbHelpers.js`)

### Functions

1. **`cleanOldData(daysOld)`**
   - Removes old AI assistant logs (keeps rated ones)
   - Configurable retention period

2. **`getUserStats(userId)`**
   - Returns user statistics:
     - Total logs, goals, completed goals
     - Recent activity (last 7 days)
     - Completion rate

3. **`exportUserData(userId)`**
   - Exports all user data as JSON
   - Includes: user, logs, goals, AI logs
   - For data portability/GDPR compliance

4. **`sanitizeInput(input, type)`**
   - Sanitizes user input by type
   - Prevents injection attacks
   - Enforces length limits

5. **`paginate(query, page, limit)`**
   - Paginates query results
   - Returns data + pagination metadata
   - Efficient for large datasets

---

## 📈 Performance Optimizations

### Indexes

**User Model**:
- `email` (unique, fast lookups)
- `astrology.lifePath` (filtering by life path)
- `blueprint.generated` (filtering by generation status)
- `createdAt`, `lastLogin` (sorting)

**DailyLog Model**:
- Compound indexes for common queries:
  - `user + date` (daily logs)
  - `user + category + date` (category filtering)
  - `user + date + activity` (deduplication)

**Goal Model**:
- Compound indexes for filtering:
  - `user + status` (active/completed goals)
  - `user + category + status` (category filtering)
  - `user + deadline` (upcoming deadlines)
  - `user + priority + status` (priority filtering)

**AIAssistantLog Model**:
- `user + createdAt` (recent interactions)
- `provider + createdAt` (provider analytics)
- `user + rating` (feedback analysis)

---

## 🔄 Connection Management

### Retry Logic
- **5 retry attempts** with exponential backoff
- Initial delay: 5 seconds
- Backoff multiplier: 1.5x
- Final delay: ~38 seconds

### Event Handlers
- **`error`**: Logs connection errors
- **`disconnected`**: Attempts auto-reconnect
- **`reconnected`**: Logs successful reconnection
- **`SIGINT`**: Graceful shutdown

---

## 📝 Best Practices

1. **Always use indexes** for frequently queried fields
2. **Use compound indexes** for multi-field queries
3. **Sanitize all inputs** before database operations
4. **Use connection pooling** for better performance
5. **Monitor database health** regularly
6. **Clean old data** periodically to save space
7. **Export user data** for backup/GDPR compliance

---

## 🚀 Production Checklist

- ✅ Connection pooling configured
- ✅ Retry logic implemented
- ✅ Health check endpoint available
- ✅ Indexes created for performance
- ✅ Input validation middleware
- ✅ Data sanitization
- ✅ Error handling
- ✅ Graceful shutdown
- ✅ Database statistics tracking

---

## 📚 Model Usage Examples

### Import Models
```javascript
const { User, DailyLog, Goal, AIAssistantLog } = require('./models');
```

### Create User
```javascript
const user = new User({ name, email, password, dob });
await user.save();
```

### Create Daily Log
```javascript
const log = new DailyLog({
  user: userId,
  category: 'health',
  activity: 'Morning workout',
  duration: 30
});
await log.save();
```

### Create Goal
```javascript
const goal = new Goal({
  user: userId,
  category: 'health',
  title: 'Lose 10kg',
  targetValue: 68,
  currentValue: 75,
  unit: 'kg',
  deadline: new Date('2025-12-31')
});
await goal.save();
```

---

## 🔍 Monitoring

### Health Check
```bash
curl http://localhost:5000/health
```

### Database Stats
```javascript
const { getDatabaseStats } = require('./config/database');
const stats = await getDatabaseStats();
console.log(stats);
```

---

**Last Updated**: 2025-01-14
**Version**: 1.0.0

