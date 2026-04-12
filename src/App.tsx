/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { InterviewSetupPage } from '@/pages/InterviewSetupPage';
import { LiveInterviewPage } from '@/pages/LiveInterviewPage';
import { FeedbackPage } from '@/pages/FeedbackPage';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" {...{ children: null } as any}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/setup" element={
                <ProtectedRoute>
                  <InterviewSetupPage />
                </ProtectedRoute>
              } />
              
              <Route path="/interview/:sessionId" element={
                <ProtectedRoute>
                  <LiveInterviewPage />
                </ProtectedRoute>
              } />
              
              <Route path="/feedback/:sessionId" element={
                <ProtectedRoute>
                  <FeedbackPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}


