import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, User, LogOut, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-black text-white border-b border-red-900/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-red-600 p-1.5 rounded-lg group-hover:bg-red-500 transition-colors">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            VOICE<span className="text-red-600">COACH</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:text-red-500 hover:bg-white/5">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/setup">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Start Interview
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-10 w-10 rounded-full p-0 outline-none focus-visible:ring-2 focus-visible:ring-red-600 hover:bg-white/10 transition-colors cursor-pointer">
                  <Avatar className="h-10 w-10 border-2 border-red-600/20">
                    <AvatarImage src={profile?.photoURL || undefined} alt={profile?.name} />
                    <AvatarFallback className="bg-red-900 text-red-100">
                      {profile?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black border-red-900/20 text-white">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile?.name}</p>
                      <p className="text-xs text-muted-foreground truncate w-[180px]">
                        {profile?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-red-600/10 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-600/10 cursor-pointer text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:text-red-500 hover:bg-white/5">
                  Login
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
