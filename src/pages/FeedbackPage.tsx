import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { InterviewSession } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  BookOpen, 
  MessageSquare,
  ArrowLeft,
  Download,
  Share2,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';

export function FeedbackPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      try {
        const docRef = doc(db, 'sessions', sessionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSession({ id: docSnap.id, ...docSnap.data() } as InterviewSession);
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!session || !session.feedback) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Feedback not found</h1>
        <Link to="/dashboard">
          <Button className="bg-red-600">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const { feedback } = session;

  const scoreMetrics = [
    { label: 'Communication', value: feedback.communicationScore, color: 'bg-blue-500' },
    { label: 'Technical', value: feedback.technicalScore, color: 'bg-red-600' },
    { label: 'Clarity', value: feedback.clarityScore, color: 'bg-amber-500' },
    { label: 'Confidence', value: feedback.confidenceScore, color: 'bg-emerald-500' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-black">Interview <span className="text-red-600">Feedback</span></h1>
            <p className="text-muted-foreground">{session.setup.role} • {session.setup.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-200 font-bold">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        <Card className="lg:col-span-1 bg-black text-white border-none flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-2">Overall Score</p>
            <div className="text-7xl font-black mb-4">{feedback.overallScore}</div>
            <Badge className="bg-red-600 text-white border-none px-4 py-1 text-sm">
              {feedback.overallScore >= 80 ? 'Excellent' : feedback.overallScore >= 60 ? 'Good' : 'Needs Practice'}
            </Badge>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl" />
        </Card>

        <Card className="lg:col-span-3 border-red-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-black text-black">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {scoreMetrics.map((metric, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-zinc-600">{metric.label}</span>
                  <span className="text-xl font-black text-black">{metric.value}%</span>
                </div>
                <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full ${metric.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detailed Feedback */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-zinc-200 rounded-none h-12 p-0 gap-8">
              <TabsTrigger value="summary" className="data-[state=active]:border-b-2 data-[state=active]:border-red-600 data-[state=active]:text-red-600 rounded-none bg-transparent px-0 font-bold text-zinc-500">Summary</TabsTrigger>
              <TabsTrigger value="transcript" className="data-[state=active]:border-b-2 data-[state=active]:border-red-600 data-[state=active]:text-red-600 rounded-none bg-transparent px-0 font-bold text-zinc-500">Full Transcript</TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:border-b-2 data-[state=active]:border-red-600 data-[state=active]:text-red-600 rounded-none bg-transparent px-0 font-bold text-zinc-500">Detailed Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="pt-6 space-y-8">
              <div className="prose prose-zinc max-w-none">
                <p className="text-lg text-zinc-700 leading-relaxed italic">
                  "{feedback.summary}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-emerald-100 bg-emerald-50/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black text-emerald-700 flex items-center gap-2 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      Key Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feedback.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-zinc-700 flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-100 bg-red-50/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black text-red-700 flex items-center gap-2 uppercase tracking-wider">
                      <XCircle className="w-4 h-4" />
                      Improvement Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feedback.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-zinc-700 flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transcript" className="pt-6">
              <div className="space-y-4">
                {session.transcript.map((msg, i) => (
                  <div key={i} className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-zinc-50 border border-zinc-100 ml-8' : 'bg-red-50/30 border border-red-100 mr-8'}`}>
                    <p className="text-xs font-black uppercase tracking-widest mb-2 text-zinc-400">
                      {msg.role === 'user' ? 'You' : 'AI Interviewer'}
                    </p>
                    <p className="text-sm text-zinc-800 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="pt-6">
              <Card className="border-zinc-100">
                <CardContent className="p-6 whitespace-pre-wrap text-zinc-700 leading-relaxed">
                  {feedback.detailedAnalysis}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card className="border-red-100 shadow-lg shadow-red-600/5">
            <CardHeader>
              <CardTitle className="text-lg font-black text-black flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-red-600" />
                Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Next Steps</p>
                <div className="space-y-2">
                  {feedback.improvementTips.map((tip, i) => (
                    <div key={i} className="flex gap-3 text-sm text-zinc-700">
                      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0 text-[10px] font-bold">
                        {i + 1}
                      </div>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Practice Exercises</p>
                <div className="space-y-2">
                  {feedback.practiceExercises.map((ex, i) => (
                    <div key={i} className="flex gap-3 text-sm text-zinc-700">
                      <BookOpen className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      {ex}
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/setup">
                <Button className="w-full bg-black hover:bg-red-600 text-white font-bold h-12 rounded-xl mt-4">
                  Practice Again
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-red-600" />
                <h4 className="font-bold">Growth Mindset</h4>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                You've improved by 12% in technical clarity since your last session. Keep practicing to reach your goal of 90%.
              </p>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                View Progress Chart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
