import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { geminiService } from '@/services/gemini';
import { InterviewSetup, InterviewSession } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Layers, 
  Code, 
  Target, 
  ListOrdered, 
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export function InterviewSetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [setup, setSetup] = useState<InterviewSetup>({
    role: '',
    level: 'mid',
    stack: [],
    type: 'mixed',
    questionCount: 5,
    focusAreas: []
  });

  const [currentStack, setCurrentStack] = useState('');
  const [currentFocus, setCurrentFocus] = useState('');

  const handleAddStack = () => {
    if (currentStack && !setup.stack.includes(currentStack)) {
      setSetup({ ...setup, stack: [...setup.stack, currentStack] });
      setCurrentStack('');
    }
  };

  const handleAddFocus = () => {
    if (currentFocus && !setup.focusAreas.includes(currentFocus)) {
      setSetup({ ...setup, focusAreas: [...setup.focusAreas, currentFocus] });
      setCurrentFocus('');
    }
  };

  const removeStack = (item: string) => {
    setSetup({ ...setup, stack: setup.stack.filter(s => s !== item) });
  };

  const removeFocus = (item: string) => {
    setSetup({ ...setup, focusAreas: setup.focusAreas.filter(f => f !== item) });
  };

  const handleStart = async () => {
    if (!setup.role) {
      toast.error("Please enter a job role");
      return;
    }

    setLoading(true);
    try {
      // 1. Generate questions using Gemini
      const questions = await geminiService.generateInterviewPlan(setup);
      
      if (questions.length === 0) {
        throw new Error("Failed to generate questions");
      }

      // 2. Create session in Firestore
      const sessionData: Omit<InterviewSession, 'id'> = {
        userId: user?.uid || 'guest',
        setup,
        status: 'pending',
        transcript: [],
        questions,
        answers: [],
        duration: 0,
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, 'sessions'), sessionData);
      
      toast.success("Interview plan generated!");
      navigate(`/interview/${docRef.id}`);
    } catch (error) {
      console.error("Error starting interview:", error);
      toast.error("Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-black mb-4">Configure Your <span className="text-red-600">Interview</span></h1>
        <p className="text-muted-foreground">Tell us about the role you're targeting, and our AI will prepare a custom interview plan.</p>
      </div>

      <Card className="border-red-100 shadow-xl shadow-red-600/5 overflow-hidden">
        <div className="h-2 bg-red-600 w-full" />
        <CardHeader>
          <CardTitle className="text-2xl font-black flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-red-600" />
            Interview Details
          </CardTitle>
          <CardDescription>Fill in the details below to get started.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Role & Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-red-600" />
                Job Role
              </Label>
              <Input 
                id="role" 
                placeholder="e.g. Senior Frontend Engineer" 
                value={setup.role}
                onChange={(e) => setSetup({ ...setup, role: e.target.value })}
                className="h-11 border-red-100 focus-visible:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level" className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-600" />
                Seniority Level
              </Label>
              <Select 
                value={setup.level} 
                onValueChange={(v: any) => setSetup({ ...setup, level: v })}
              >
                <SelectTrigger className="h-11 border-red-100 focus:ring-red-600">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="lead">Lead / Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <Label className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-red-600" />
              Tech Stack
            </Label>
            <div className="flex gap-2">
              <Input 
                placeholder="e.g. React, TypeScript, Node.js" 
                value={currentStack}
                onChange={(e) => setCurrentStack(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddStack()}
                className="h-11 border-red-100 focus-visible:ring-red-600"
              />
              <Button onClick={handleAddStack} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 h-11">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {setup.stack.map(s => (
                <Badge key={s} className="bg-zinc-100 text-black hover:bg-zinc-200 py-1.5 px-3 rounded-lg flex items-center gap-2 border-none">
                  {s}
                  <X className="w-3 h-3 cursor-pointer text-red-600" onClick={() => removeStack(s)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Interview Type & Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-red-600" />
                Interview Type
              </Label>
              <Select 
                value={setup.type} 
                onValueChange={(v: any) => setSetup({ ...setup, type: v })}
              >
                <SelectTrigger className="h-11 border-red-100 focus:ring-red-600">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Focus</SelectItem>
                  <SelectItem value="behavioral">Behavioral Focus</SelectItem>
                  <SelectItem value="mixed">Mixed (Recommended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-red-600" />
                Number of Questions
              </Label>
              <Select 
                value={setup.questionCount.toString()} 
                onValueChange={(v) => setSetup({ ...setup, questionCount: parseInt(v) })}
              >
                <SelectTrigger className="h-11 border-red-100 focus:ring-red-600">
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Questions (Quick)</SelectItem>
                  <SelectItem value="5">5 Questions (Standard)</SelectItem>
                  <SelectItem value="8">8 Questions (In-depth)</SelectItem>
                  <SelectItem value="12">12 Questions (Full Loop)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="space-y-3">
            <Label className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              Focus Areas (Optional)
            </Label>
            <div className="flex gap-2">
              <Input 
                placeholder="e.g. System Design, React Hooks, Leadership" 
                value={currentFocus}
                onChange={(e) => setCurrentFocus(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddFocus()}
                className="h-11 border-red-100 focus-visible:ring-red-600"
              />
              <Button onClick={handleAddFocus} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 h-11">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {setup.focusAreas.map(f => (
                <Badge key={f} className="bg-red-50 text-red-600 hover:bg-red-100 py-1.5 px-3 rounded-lg flex items-center gap-2 border-none">
                  {f}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeFocus(f)} />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-zinc-50 p-8 border-t border-red-100">
          <Button 
            onClick={handleStart} 
            className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-red-600/20"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Generating Interview Plan...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Generate & Start Interview
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
