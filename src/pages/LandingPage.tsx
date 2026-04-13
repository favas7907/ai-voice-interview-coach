import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { 
  Mic, 
  BrainCircuit, 
  MessageSquareText, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-600 text-sm font-bold mb-6">
                  AI-POWERED INTERVIEW PREP
                </span>
                <h1 className="text-5xl lg:text-7xl font-black text-black leading-tight mb-6">
                  Master Your Interview with <span className="text-red-600">AI Voice</span> Coaching
                </h1>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0">
                  Practice real-time voice interviews with our advanced AI. Get instant feedback, 
                  personalized questions, and the confidence to land your dream job.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link to="/login">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 h-14 text-lg font-bold rounded-xl shadow-lg shadow-red-600/20">
                      Start Free Practice
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 h-14 text-lg font-bold rounded-xl">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative z-10"
              >
                <div className="bg-black rounded-3xl p-4 shadow-2xl shadow-red-600/10 border border-red-900/20">
                  <img 
                    src="https://picsum.photos/seed/interview/800/600" 
                    alt="AI Interview Interface" 
                    className="rounded-2xl w-full h-auto opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-red-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Success Rate</p>
                      <p className="text-xl font-black text-black">+85% Improvement</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-red-600/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">Why Choose <span className="text-red-600">VoiceCoach</span>?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with professional recruitment insights to give you the most realistic practice experience possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mic className="w-8 h-8" />,
                title: "Real-Time Voice",
                desc: "Natural conversation with low latency. It feels like talking to a real human recruiter."
              },
              {
                icon: <BrainCircuit className="w-8 h-8" />,
                title: "AI Analysis",
                desc: "Deep analysis of your answers, tone, and clarity using advanced language models."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Feedback",
                desc: "Receive a detailed scorecard and improvement tips immediately after your session."
              },
              {
                icon: <MessageSquareText className="w-8 h-8" />,
                title: "Tailored Questions",
                desc: "Questions generated specifically for your target role, seniority, and tech stack."
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Confidence Building",
                desc: "Practice in a safe, stress-free environment until you're ready for the real thing."
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Progress Tracking",
                desc: "Monitor your improvement over time with our comprehensive dashboard and history."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-red-600/50 transition-colors group"
              >
                <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-red-600 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black mb-8">Ready to Land Your Dream Job?</h2>
              <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
                Join thousands of candidates who used VoiceCoach to prepare for interviews at top tech companies.
              </p>
              <Link to="/login">
                <Button size="lg" className="bg-black hover:bg-zinc-900 text-white px-10 h-16 text-xl font-bold rounded-2xl">
                  Get Started for Free
                </Button>
              </Link>
            </div>
            
            {/* Background accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
