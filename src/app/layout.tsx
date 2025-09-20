import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

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
      <body className={`${poppins.className} antialiased`}>
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
