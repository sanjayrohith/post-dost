import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: 'PostDost AI',
  description: 'AI-Powered Social Media Posts for Local Indian Businesses',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <div className="relative min-h-screen w-full" suppressHydrationWarning>
            <Navbar />
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
