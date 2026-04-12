import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { InterviewSession, TranscriptMessage } from '@/types';
import { voiceService } from '@/services/voice';
import { geminiService } from '@/services/gemini';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  PhoneOff, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  Volume2,
  VolumeX,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export function LiveInterviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      try {
        const docRef = doc(db, 'sessions', sessionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSession({ id: docSnap.id, ...docSnap.data() } as InterviewSession);
        } else {
          toast.error("Session not found");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        toast.error("Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, navigate]);

  useEffect(() => {
    if (isInterviewing) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isInterviewing]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, interimText]);

  const startInterview = () => {
    setIsInterviewing(true);
    const firstQuestion = session?.questions[0] || "Hello! I'm your AI interviewer. Shall we begin?";
    speakQuestion(firstQuestion);
  };

  const speakQuestion = (text: string) => {
    setIsSpeaking(true);
    setTranscript(prev => [...prev, { role: 'interviewer', text, timestamp: Date.now() }]);
    
    voiceService.speak(text, () => {
      setIsSpeaking(false);
      startListening();
    });
  };

  const startListening = () => {
    setIsListening(true);
    voiceService.start({
      onTranscript: (text, isFinal) => {
        if (isFinal) {
          setTranscript(prev => [...prev, { role: 'user', text, timestamp: Date.now() }]);
          setInterimText('');
          handleUserResponse(text);
        } else {
          setInterimText(text);
        }
      },
      onError: (err) => {
        console.error("Voice error:", err);
        setIsListening(false);
      }
    });
  };

  const handleUserResponse = (text: string) => {
    voiceService.stop();
    setIsListening(false);

    // Logic to move to next question or end
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < (session?.questions.length || 0)) {
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => {
        speakQuestion(session!.questions[nextIndex]);
      }, 1000);
    } else {
      endInterview();
    }
  };

  const endInterview = async () => {
    setIsInterviewing(false);
    voiceService.stop();
    voiceService.cancelSpeech();
    
    toast.info("Interview completed! Generating feedback...");
    
    try {
      // 1. Generate feedback
      const feedback = await geminiService.generateFeedback({
        transcript,
        setup: session!.setup
      });

      // 2. Update Firestore
      const sessionRef = doc(db, 'sessions', sessionId!);
      await updateDoc(sessionRef, {
        status: 'completed',
        transcript,
        duration: timer,
        score: feedback.overallScore,
        feedback
      });

      navigate(`/feedback/${sessionId}`);
    } catch (error) {
      console.error("Error ending interview:", error);
      toast.error("Failed to generate feedback. You can view your transcript in the dashboard.");
      navigate('/dashboard');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {!isInterviewing ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl"
          >
            <div className="w-24 h-24 bg-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/20">
              <Mic className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black text-black mb-4">Ready to Start?</h1>
            <p className="text-muted-foreground mb-8">
              Your interview for <span className="text-black font-bold">{session?.setup.role}</span> is ready. 
              Make sure you're in a quiet environment and your microphone is working.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={startInterview} size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-10 font-bold rounded-xl">
                Start Voice Interview
              </Button>
              <Button onClick={() => navigate('/dashboard')} variant="outline" size="lg" className="h-14 px-10 font-bold rounded-xl border-black">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)]">
          {/* Main Interaction Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="flex-1 flex flex-col border-red-100 shadow-xl shadow-red-600/5 overflow-hidden">
              <CardHeader className="bg-black text-white py-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                  <CardTitle className="text-lg font-bold">Live Interview</CardTitle>
                </div>
                <div className="flex items-center gap-4 text-sm font-mono">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-red-600" />
                    {formatTime(timer)}
                  </span>
                  <Badge variant="outline" className="text-white border-white/20">
                    Q {currentQuestionIndex + 1} / {session?.questions.length}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-red-100">
                <AnimatePresence initial={false}>
                  {transcript.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-red-600 text-white rounded-tr-none' 
                          : 'bg-zinc-100 text-black rounded-tl-none'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  {interimText && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[80%] p-4 rounded-2xl bg-red-600/50 text-white rounded-tr-none italic">
                        <p className="text-sm leading-relaxed">{interimText}...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={transcriptEndRef} />
              </CardContent>

              <div className="p-6 bg-zinc-50 border-t border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isListening ? 'bg-red-600 animate-bounce' : 'bg-zinc-200'
                  }`}>
                    {isListening ? <Mic className="text-white w-6 h-6" /> : <MicOff className="text-zinc-500 w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">
                      {isSpeaking ? 'Interviewer is speaking...' : isListening ? 'Listening to you...' : 'Waiting...'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isListening ? 'Speak clearly into your microphone' : ''}
                    </p>
                  </div>
                </div>
                <Button onClick={endInterview} variant="destructive" className="bg-black hover:bg-red-600 text-white font-bold px-6">
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Session
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="text-lg font-black text-black">Interview Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Target Role</p>
                  <p className="font-bold text-black">{session?.setup.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Level</p>
                  <Badge className="bg-red-50 text-red-600 border-none capitalize">{session?.setup.level}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {session?.setup.stack.map(s => (
                      <Badge key={s} variant="outline" className="text-[10px] border-zinc-200">{s}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-100">
              <CardContent className="p-6 flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-red-900 text-sm">Need a moment?</h4>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">
                    If you need to think, just say "Give me a second to think about that." The AI will wait for you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
