# AI Interview Coach

An intelligent interview simulation platform built with Next.js 15 that helps users practice and improve their interview skills through AI-powered conversations, real-time feedback, and performance analytics.

## 🚀 Features

- **AI-Powered Interviews**: Realistic interview simulations using Google Gemini AI
- **Real-time Feedback**: Instant scoring and suggestions during interviews
- **Audio & Video Recording**: Full interview recording with webcam integration
- **Text-to-Speech**: Natural AI interviewer voice using ElevenLabs
- **Performance Analytics**: Detailed dashboards with improvement insights
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API
- **Text-to-Speech**: ElevenLabs API
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Cloud Storage

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-interview-coach.git
cd ai-interview-coach
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your API keys and configuration values.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

### Required API Keys

1. **Google Gemini API**: Get your key from [Google AI Studio](https://makersuite.google.com/)
2. **ElevenLabs API**: Sign up at [ElevenLabs](https://elevenlabs.io/) for text-to-speech
3. **Firebase**: Create a project at [Firebase Console](https://console.firebase.google.com/)

### Environment Variables

See `.env.local` for all required environment variables and their descriptions.

## 📁 Project Structure

```
📦 ai-interview-coach/
├── 📁 app/                           # Next.js App Router
│   ├── layout.tsx                    # Global layout and navbar
│   ├── page.tsx                      # Landing page
│   ├── 📁 interview/                 # Interview simulation
│   ├── 📁 dashboard/                 # Results dashboard
│   └── 📁 api/                       # API routes
├── 📁 components/                    # Shared UI components
├── 📁 lib/                           # API wrappers and utilities
├── 📁 types/                         # TypeScript type definitions
├── 📁 hooks/                         # Custom React hooks
├── 📁 styles/                        # CSS styles
└── 📁 public/                        # Static assets
```
