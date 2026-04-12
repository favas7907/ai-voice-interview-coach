import React from 'react';
import { Mic } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-black text-white py-12 border-t border-red-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-600 p-1.5 rounded-lg">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">
                  VOICE<span className="text-red-600">COACH</span>
                </span>
              </div>
              <p className="text-muted-foreground max-w-sm">
                Master your next interview with our AI-powered voice coach. 
                Real-time feedback, tailored questions, and professional insights.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-red-500">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-red-500">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Voice Interview Coach. All rights reserved.
          </div>
        </div>
      </footer>
      <Toaster position="top-center" richColors />
    </div>
  );
}
