'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SquareKanban, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, logout, loading, isClient } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-transparent sticky top-0 z-50">
      <nav className="flex items-center justify-between container mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold font-headline text-primary"
        >
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <SquareKanban className="h-5 w-5" />
          </div>
          Post-Dost
        </Link>
        
        {!isClient || loading ? (
          <div className="w-20 h-10 bg-zinc-800 animate-pulse rounded-lg" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="rounded-lg bg-primary hover:bg-primary/90"
              >
                <User className="mr-2 h-4 w-4" />
                {user.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-primary/50 text-primary hover:bg-primary/10"
            >
              <Link href="/signup">
                <User className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </Button>
            <Button
              asChild
              variant="default"
              className="rounded-lg bg-primary hover:bg-primary/90"
            >
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
