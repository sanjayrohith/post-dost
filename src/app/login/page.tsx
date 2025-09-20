'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { login, user, loading, isClient } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isClient && !loading && user) {
      router.push('/');
    }
  }, [user, loading, isClient, router]);

  // Show loading while checking authentication
  if (!mounted || !isClient || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome back! Redirecting to dashboard...',
        });
        router.push('/');
      } else {
        toast({
          title: 'Login Failed',
          description: result.error || 'Invalid credentials. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    {...register('email')}
                    className="rounded-lg bg-zinc-900/60 border-white/20 placeholder:text-muted-foreground/60"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-primary font-semibold"
                  >
                    PASSWORD
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className="rounded-lg bg-zinc-900/60 border-white/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-lg font-bold rounded-lg transition-transform transform hover:scale-105 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </form>
              
              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <p className="text-sm text-center text-muted-foreground mb-2 font-semibold">
                  Demo Credentials:
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Email:</strong> demo@example.com</p>
                  <p><strong>Password:</strong> password123</p>
                </div>
              </div>
              
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  href="/signup"
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
