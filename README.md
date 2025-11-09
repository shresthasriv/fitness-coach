# 🏋️ AI Fitness Coach App

A modern, AI-powered fitness assistant that generates personalized workout and diet plans using Google Gemini AI and ElevenLabs Text-to-Speech.

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ Features

### 🎯 Personalized AI Plans
- **Workout Plans** - 5-6 day routines with exercises, sets, reps, and rest times
- **Diet Plans** - Complete meal breakdown with macros (breakfast, lunch, dinner, snacks)
- **AI Tips** - Lifestyle, posture, and recovery recommendations
- **Motivation** - Daily AI-generated motivational quotes

### 🎨 User Experience
- **Dark/Light Mode** - Smooth animated theme switching with View Transition API
- **Expandable Workouts** - Collapsible workout cards (first one expanded by default)
- **Floating Header** - Morphs into rounded floating navbar on scroll
- **Blur Fade Animations** - Smooth content reveal animations
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop

### 🖼️ AI Image Generation
- Click any exercise or meal to generate realistic AI images
- Image caching to prevent regeneration
- Powered by Gemini 2.5 Flash Image API

### 🔊 Text-to-Speech
- Read workout or diet plans aloud using ElevenLabs
- Independent controls for workout and diet sections
- Audio playback with play/stop controls

### 📄 Export & Share
- Export complete fitness plan as PDF
- Save plans in browser localStorage
- Regenerate plans anytime

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + Shadcn UI |
| **AI** | Google Gemini 2.5 Flash |
| **Voice** | ElevenLabs TTS |
| **Images** | Gemini Image API |
| **Forms** | React Hook Form + Zod |
| **Animations** | Framer Motion |
| **PDF** | jsPDF |
| **Notifications** | Sonner |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Gemini API Key ([Get here](https://aistudio.google.com/app/apikey))
- ElevenLabs API Key ([Get here](https://elevenlabs.io/))

### Installation

```bash
# Clone the repository
git clone https://github.com/shresthasriv/fitness-coach.git
cd fitness-coach

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Add your API keys to .env.local
# GEMINI_API_KEY=your_gemini_key
# ELEVENLABS_API_KEY=your_elevenlabs_key

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure

```
fitness-coach-app/
├── app/
│   ├── api/                  # API routes (serverless functions)
│   │   ├── generate-plan/    # Gemini AI plan generation
│   │   ├── generate-image/   # Gemini image generation
│   │   ├── motivation/       # AI motivation quotes
│   │   └── text-to-speech/   # ElevenLabs TTS
│   ├── layout.tsx            # Root layout with theme
│   ├── page.tsx              # Main application page
│   └── globals.css           # Global styles + CSS variables
├── components/
│   ├── forms/
│   │   └── UserDetailsForm.tsx
│   ├── plan/
│   │   ├── WorkoutPlan.tsx   # Expandable workout cards
│   │   ├── DietPlan.tsx
│   │   ├── AITips.tsx
│   │   └── PlanActions.tsx
│   ├── ui/                   # Shadcn UI components
│   ├── Header.tsx            # Floating navbar
│   ├── ImageModal.tsx
│   └── AnimatedThemeToggler.tsx
├── lib/
│   ├── gemini.ts             # Gemini AI integration
│   ├── elevenlabs.ts         # ElevenLabs integration
│   ├── storage.ts            # localStorage utilities
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # Helper functions
└── public/                   # Static assets
```

## 🎯 User Flow

1. **Fill Form** → Enter personal details, fitness goals, dietary preferences
2. **AI Generation** → Gemini creates personalized workout & diet plan
3. **View Plan** → Browse workouts (expandable cards), diet, and tips
4. **Interact**:
   - Click exercises/meals for AI-generated images
   - Use TTS to listen to workout/diet plans
   - Export as PDF for offline use
5. **Regenerate** → Create new plan anytime

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px - Minimal buttons, stacked layout
- **Tablet**: 768px - 1024px - More buttons visible
- **Desktop**: > 1024px - Full feature set, motivation in header

## 🎨 Theming

Uses CSS variables with OKLCH color space for consistent theming:
- Light mode (default)
- Dark mode
- Smooth transitions via View Transition API

## 🧪 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📊 Features Breakdown

### Form Validation
- Zod schema validation
- Real-time error messages
- Type-safe form handling

### State Management
- React hooks (useState, useEffect)
- LocalStorage persistence
- No external state libraries needed

### Performance
- Server-side rendering (SSR)
- API routes as serverless functions
- Image caching
- Lazy loading
