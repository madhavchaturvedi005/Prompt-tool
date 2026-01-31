# PromptLab - AI Prompt Engineering Platform

A comprehensive platform for learning, practicing, and mastering prompt engineering with AI-powered evaluation, challenges, and a curated prompt library.

## 🚀 Features

### 🎯 Weekly Challenges
- Structured prompt engineering challenges
- AI-powered evaluation with detailed feedback
- Progress tracking and scoring system
- Difficulty levels from beginner to advanced

### 🏟️ Dynamic Practice Arena
- **AI-Generated Challenges**: Unique challenges created on-demand by GPT-4
- **Three-Stage Evaluation System**:
  - Generator LLM creates diverse challenges
  - Worker LLM executes your prompt
  - Judge LLM provides detailed grading
- **5-Minute Timed Sessions**: Test your skills under pressure
- **Three Difficulty Levels**: Easy, Medium, Hard
- **Five Categories**: Coding, Creative Writing, Data Extraction, Chatbot Persona, Logical Reasoning
- **Detailed Feedback**: Score breakdown with specific improvement suggestions
- **Constraint-Based Challenges**: Learn to work within specific rules and limitations

### 🎨 Prompt Refinery
- **Template-Based Optimization**: Four specialized modes
  - **Primer**: Quick, concise prompts (50-150 words)
  - **Mastermind**: Professional, structured prompts (200-400 words)
  - **AI Amplifier**: Extremely detailed prompts (400-600 words)
  - **JSON Mode**: Structured JSON output with schemas
- **AI-Powered Enhancement**: Transform simple ideas into expert-level prompts
- **Real-Time Generation**: Instant prompt optimization

### 📚 Prompt Library (1000+ Prompts)
- **Semantic Search**: AI-powered similarity search using Qdrant
- **Featured Prompts**: Curated collection of high-quality prompts
- **Category Filtering**: Coding, Writing, Business, Creative, Analysis, Education
- **Save & Organize**: Personal collections and favorites
- **Usage Tracking**: See what's popular in the community

### 🏆 Gamification System
- Points and achievements system
- Global leaderboards
- Streak tracking
- Progress analytics and insights

### 👤 User Profiles & Authentication
- Secure user registration and login
- Personalized dashboards
- Learning preferences and goals
- Social features and community interaction

## 🛠️ Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Supabase or Local)
- **Vector Database**: Qdrant for semantic search
- **AI Integration**: 
  - OpenAI GPT-4o for evaluations and generation
  - Three-stage LLM system (Generator, Worker, Judge)
- **Authentication**: Supabase Auth with JWT
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: React Context + TanStack Query

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up Supabase Database** (Recommended - Always Available)
```bash
# Follow the Supabase setup guide
# See SUPABASE_SETUP.md for detailed instructions
npm run setup:supabase
```

**Alternative: Local Database** (Only works when your system is on)
```bash
# Install and start PostgreSQL locally
# Create database: createdb promptlab
npm run setup:database
```

5. **Start the development server**
```bash
npm run dev
```

## 🌐 **Database Options**

### 🚀 **Supabase (Recommended)**
- ✅ **Always Available** - Works 24/7, even when your computer is off
- ✅ **Free Tier** - Perfect for development and small projects
- ✅ **No Setup** - No local PostgreSQL installation needed
- ✅ **Cloud Dashboard** - Beautiful web interface to manage data
- ✅ **Automatic Backups** - Your data is safe

**Setup**: Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 🖥️ **Local PostgreSQL**
- ⚠️ **Only Available When System is On** - Stops when computer is off
- ✅ **Full Control** - Complete control over your database
- ✅ **No Internet Required** - Works offline

**Setup**: Follow [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### 🎭 **Mock Data (Fallback)**
- ✅ **Always Works** - No setup required
- ❌ **No Persistence** - Data resets on page refresh
- ❌ **Limited Features** - Some features unavailable

**Setup**: No setup needed - works automatically if no database is configured

## 🗄️ Database Setup

PromptLab supports multiple database options to fit your needs:

### 🌟 **Supabase (Recommended)**
**Always-available cloud PostgreSQL database**

```bash
# Quick Supabase setup
npm run setup:supabase
```

**Benefits:**
- ✅ Works 24/7 (even when your computer is off)
- ✅ Free tier with 500MB storage
- ✅ Automatic backups and SSL security
- ✅ Beautiful dashboard to manage data
- ✅ No local PostgreSQL installation needed

**Setup Guide:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 🖥️ **Local PostgreSQL**
**Traditional local database setup**

```bash
# Local database setup
npm run setup:database
```

**Benefits:**
- ✅ Full control over your data
- ✅ Works offline
- ❌ Only available when your system is running
- ❌ Requires PostgreSQL installation

**Setup Guide:** [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### 🎭 **Mock Data (Automatic Fallback)**
**No setup required - works out of the box**

- ✅ Zero configuration
- ✅ Perfect for quick testing
- ❌ Data doesn't persist between sessions
- ❌ Limited functionality

The app automatically uses mock data when no database is configured.

## 🔧 Configuration

### Environment Variables

```env
# OpenAI API (Required for all AI features)
VITE_OPENAI_API_KEY=your_openai_api_key

# Supabase (Recommended - Always Available)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Qdrant Vector Database (Required for prompt library)
VITE_QDRANT_URL=your_qdrant_url
VITE_QDRANT_API_KEY=your_qdrant_api_key

# Optional: Qdrant Backend (for advanced features)
VITE_QDRANT_BACKEND_URL=http://localhost:3001
```

### Development vs Production

**Development Mode**:
- Uses mock data if database is not available
- Fallback authentication system
- Local development optimizations

**Production Mode**:
- Requires database connection
- Full authentication and data persistence
- Performance optimizations and security features

## 📚 Usage

### For Learners
1. **Register an account** to track progress
2. **Practice Arena**: Generate unique challenges and test your skills
   - Select difficulty level (Easy/Medium/Hard)
   - Write prompts within 5-minute time limit
   - Get instant AI-powered feedback
3. **Refine Prompts**: Use the Prompt Refinery to optimize your prompts
   - Choose from 4 specialized templates
   - Transform simple ideas into expert prompts
4. **Weekly Challenges**: Complete structured challenges for points
5. **Browse Library**: Explore 1000+ curated prompts with semantic search
6. **Track Progress**: Monitor your improvement on the dashboard

### For Educators
1. **Monitor student progress** through the dashboard
2. **Use Practice Arena** for hands-on learning exercises
3. **Leverage analytics** to identify learning gaps
4. **Share prompts** from the library for teaching examples

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
│   ├── PracticeNew.tsx      # Dynamic practice arena
│   ├── Refine.tsx           # Prompt optimization
│   ├── LibraryQdrant.tsx    # Semantic search library
│   └── Challenges.tsx       # Weekly challenges
├── lib/           # Utilities and services
│   ├── practiceGenerator.ts # Three-stage LLM system
│   ├── qdrant.ts            # Vector search integration
│   └── supabase.ts          # Database client
├── hooks/         # Custom React hooks
├── contexts/      # React context providers
└── types/         # TypeScript type definitions
```

### Three-Stage Practice System
1. **Generator LLM** (Temperature: 0.9)
   - Creates unique challenges based on difficulty
   - Returns JSON with task, constraints, and test input

2. **Worker LLM** (Temperature: 0.7)
   - Executes user's prompt with hidden test input
   - Returns AI response for evaluation

3. **Judge LLM** (Temperature: 0)
   - Grades output against constraints
   - Returns score (0-100), feedback, and pass/fail

### Database Schema
- **Users & Authentication**: User accounts via Supabase Auth
- **Points & Achievements**: Gamification system
- **Challenges**: Challenge submissions and scores
- **Saved Prompts**: User's personal prompt collections
- **Activity Tracking**: Usage analytics and progress

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Test database connection
npm run test:database
```

## 🚀 Deployment

### Using Lovable
1. Open your [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
2. Click Share → Publish
3. Configure custom domain if needed

### Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy to your preferred hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: 
  - [PRACTICE_SYSTEM.md](./PRACTICE_SYSTEM.md) - Dynamic practice arena details
  - [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup guide
  - [QDRANT_SETUP.md](./QDRANT_SETUP.md) - Vector database setup
- **API Issues**: Verify your OpenAI and Qdrant API keys in `.env`
- **Practice Arena**: See [PRACTICE_SYSTEM.md](./PRACTICE_SYSTEM.md) for architecture details
- **General Help**: Open an issue on GitHub

## 🔮 Roadmap

- [x] Dynamic challenge generation with AI
- [x] Multi-template prompt optimization
- [x] Semantic search with Qdrant
- [x] Three-stage evaluation system
- [ ] Challenge history and analytics
- [ ] Multiplayer practice mode
- [ ] Custom challenge creation
- [ ] Mobile application
- [ ] Integration with more AI models (Claude, Gemini)
- [ ] Advanced analytics dashboard
- [ ] Prompt marketplace

---

Built with ❤️ using [Lovable](https://lovable.dev)
