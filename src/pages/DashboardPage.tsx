import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { InterviewSession } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  History, 
  TrendingUp, 
  Clock, 
  Award, 
  ChevronRight,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export function DashboardPage() {
  const { user, profile } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        const q = query(
          collection(db, 'sessions'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const sessionData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InterviewSession));
        setSessions(sessionData);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const averageScore = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-black">Welcome back, <span className="text-red-600">{profile?.name?.split(' ')[0]}</span></h1>
          <p className="text-muted-foreground">Ready for your next practice session?</p>
        </div>
        <Link to="/setup">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-6 h-12 font-bold rounded-xl shadow-lg shadow-red-600/20">
            <Plus className="w-5 h-5 mr-2" />
            New Interview
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Sessions', value: sessions.length, icon: <History className="w-5 h-5" />, color: 'bg-zinc-100 text-black' },
          { label: 'Average Score', value: `${averageScore}%`, icon: <Award className="w-5 h-5" />, color: 'bg-red-50 text-red-600' },
          { label: 'Practice Time', value: `${sessions.length * 15}m`, icon: <Clock className="w-5 h-5" />, color: 'bg-black text-white' }
        ].map((stat, i) => (
          <Card key={i} className="border-red-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-black">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sessions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-black flex items-center gap-2">
              <History className="w-5 h-5 text-red-600" />
              Recent Sessions
            </h2>
            <Button variant="ghost" size="sm" className="text-red-600 font-bold hover:bg-red-50">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
              ))
            ) : sessions.length > 0 ? (
              sessions.map((session, i) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/feedback/${session.id}`}>
                    <Card className="hover:border-red-600/50 transition-all cursor-pointer group border-red-100">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-black font-bold text-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                            {session.score || 0}
                          </div>
                          <div>
                            <h3 className="font-bold text-black">{session.setup.role}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(session.createdAt, 'MMM d, yyyy')}
                              </span>
                              <Badge variant="outline" className="text-[10px] uppercase font-bold border-red-100 text-red-600">
                                {session.setup.level}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-red-600 transition-colors" />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <Card className="border-dashed border-2 border-zinc-200 bg-zinc-50">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-bold text-black">No sessions yet</h3>
                  <p className="text-muted-foreground mb-6">Start your first interview to see your progress here.</p>
                  <Link to="/setup">
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
                      Start First Interview
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Tips / Sidebar */}
        <div className="space-y-6">
          <Card className="bg-black text-white border-none overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-xl font-black">Pro Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-sm leading-relaxed">
                "Focus on the STAR method for behavioral questions. Situation, Task, Action, and Result. 
                Our AI specifically looks for these components in your answers."
              </p>
            </CardContent>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-600/20 rounded-full blur-2xl" />
          </Card>

          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="text-lg font-black text-black">Improvement Areas</CardTitle>
              <CardDescription>Based on your last 5 sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Technical Depth', value: 65 },
                { label: 'Communication', value: 82 },
                { label: 'Confidence', value: 74 }
              ].map((area, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>{area.label}</span>
                    <span className="text-red-600">{area.value}%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 rounded-full" 
                      style={{ width: `${area.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
