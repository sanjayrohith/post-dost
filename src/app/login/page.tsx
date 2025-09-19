import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogIn } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-md">
          <Button asChild variant="outline" className="mb-8 rounded-lg">
            <Link href="/">
              <ArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </Button>
          <Card className="bg-card/50 backdrop-blur-lg border border-white/10 text-left">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary text-center">
                Welcome Back
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-primary font-semibold"
                  >
                    EMAIL
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="rounded-lg bg-zinc-900/60 border-white/20 placeholder:text-muted-foreground/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-primary font-semibold"
                  >
                    PASSWORD
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="rounded-lg bg-zinc-900/60 border-white/20"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-lg font-bold rounded-lg transition-transform transform hover:scale-105 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <LogIn className="mr-2" />
                  Login
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  href="#"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
