# AI Voice Interview Coach

A premium AI-powered mock interview platform that helps users practice job interviews in real-time through voice interaction.

## Features

- **Personalized Mock Interviews**: Tailored questions based on job role, seniority, and tech stack.
- **Real-Time Voice Interaction**: Conduct interviews using your voice, with AI that reacts naturally.
- **Detailed Feedback**: Receive comprehensive analysis, scores, and practice suggestions after each session.
- **Session History**: Track your progress and review past transcripts.
- **Premium UI**: Polished White, Red, and Black theme for a professional experience.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: Firebase (Auth, Firestore).
- **AI**: Google Gemini API.
- **Voice**: Web Speech API (Speech Recognition & Synthesis).

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Cloud Project with Gemini API enabled
- A Firebase Project

  ### Demo Link : https://ai-voice-interview-coach-weld.vercel.app/

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/favas7907/ai-voice-interview-coach.git
   cd ai-voice-interview-coach
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Fill in your Gemini API key and Firebase configuration details.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Firebase Configuration

To use authentication and the database, you must enable the following in the Firebase Console:

1. **Authentication**:
   - Enable **Email/Password** provider.
   - Enable **Google** provider (optional).
   - Enable **Anonymous** provider (for guest mode).
2. **Firestore Database**:
   - Create a Firestore database in your project.
   - Deploy the security rules provided in `firestore.rules`.

## Deployment

### Vercel / Netlify

This project is a standard Vite application. You can deploy it by connecting your GitHub repository to Vercel or Netlify. Ensure you add all environment variables from your `.env` file to the deployment settings.

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase: `firebase init`
3. Build the project: `npm run build`
4. Deploy: `firebase deploy`

## License

Apache-2.0
