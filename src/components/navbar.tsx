import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SquareKanban, User } from 'lucide-react';

export function Navbar() {
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
      </nav>
    </header>
  );
}
