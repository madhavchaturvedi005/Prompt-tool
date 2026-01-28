# PromptLab - AI Prompt Engineering Platform

A comprehensive platform for learning, practicing, and mastering prompt engineering with AI-powered evaluation, challenges, and a curated prompt library.

## 🚀 Features

### 🎯 Weekly Challenges
- Structured prompt engineering challenges
- AI-powered evaluation with detailed feedback
- Progress tracking and scoring system
- Difficulty levels from beginner to advanced

### 🏟️ Practice Arena
- Real-time prompt evaluation
- 18 comprehensive evaluation criteria
- Intelligent criteria selection based on prompt type
- Detailed feedback with strengths and improvement suggestions

### 📚 Prompt Library
- Curated collection of high-quality prompts
- Advanced search and filtering
- Save prompts to personal collections
- Category-based organization

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
- **Backend**: Node.js, Express, PostgreSQL
- **AI Integration**: OpenAI GPT-4 for evaluations
- **Vector Database**: Qdrant for prompt similarity search
- **Authentication**: JWT-based with bcrypt password hashing
- **UI Components**: shadcn/ui with Radix UI primitives

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
# Supabase Database (Recommended - Always Available)
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password

# OR Local Database (Only works when system is on)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=promptlab
# DB_USER=postgres
# DB_PASSWORD=your_password

# OpenAI API (Required for evaluations)
VITE_OPENAI_API_KEY=your_openai_api_key

# Qdrant Vector Database (Required for prompt library)
VITE_QDRANT_URL=your_qdrant_url
VITE_QDRANT_API_KEY=your_qdrant_api_key

# Authentication (Optional)
JWT_SECRET=your_jwt_secret
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
2. **Take challenges** to practice prompt engineering
3. **Use the Practice Arena** for real-time feedback
4. **Browse the Library** for inspiration and learning
5. **Track your progress** on the dashboard

### For Educators
1. **Monitor student progress** through the dashboard
2. **Create custom challenges** (coming soon)
3. **Use analytics** to identify learning gaps
4. **Leverage the community** for peer learning

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── lib/           # Utilities and services
├── hooks/         # Custom React hooks
├── contexts/      # React context providers
└── types/         # TypeScript type definitions
```

### Database Schema
- **Users & Authentication**: User accounts, sessions, profiles
- **Points & Achievements**: Gamification system
- **Challenges**: Challenge definitions and submissions
- **Practice**: Arena sessions and evaluations
- **Library**: Saved prompts and collections
- **Social**: User interactions and activity feeds

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

- **Documentation**: Check the docs folder for detailed guides
- **Database Issues**: See [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- **API Issues**: Verify your OpenAI and Qdrant API keys
- **General Help**: Open an issue on GitHub

## 🔮 Roadmap

- [ ] Advanced challenge creation tools
- [ ] Team collaboration features
- [ ] Mobile application
- [ ] Integration with more AI models
- [ ] Advanced analytics and reporting
- [ ] Marketplace for custom prompts

---

Built with ❤️ using [Lovable](https://lovable.dev)
