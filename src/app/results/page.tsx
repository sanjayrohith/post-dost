// src/app/results/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

// Navbar is no longer imported here because the layout handles it.
// import { Navbar } from '@/components/navbar'; 
import ResultsDisplay from './results-display';
import ResultsLoading from './loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define the shape of the data we expect from our API
interface PostResult {
  imageUrl: string | null;
  captions: { caption: string; hashtags: string; }[];
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [postData, setPostData] = useState<PostResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get the original form parameters from the URL for the "Generate Again" button
  const formParams = {
    productDescription: searchParams.get('productDescription') || '',
    language: searchParams.get('language') || 'English',
    tone: searchParams.get('tone') || 'Promotional',
  };

  useEffect(() => {
    const generatePost = async () => {
      // Ensure we don't run without necessary params
      if (!formParams.productDescription || !formParams.language || !formParams.tone) {
        setError('Missing required fields. Please start over.');
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formParams),
        });

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.error || 'Failed to generate post.');
        }

        const data: PostResult = await response.json();
        setPostData(data);
      } catch (err: any) {
        console.error("API call failed:", err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    generatePost();
  }, []); // Run only once when the component mounts

  // Show a loading skeleton while fetching
  if (isLoading) {
    return (
      // The parent div is removed and Navbar is gone.
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight text-center mb-4">
              Generating Your Post...
          </h1>
          <ResultsLoading />
      </main>
    );
  }

  // Show an error message if something went wrong
  if (error) {
    return (
      // Navbar is gone.
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md text-center bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertTriangle className="text-destructive" /> Generation Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button asChild className="mt-4">
              <Link href="/">Start Over</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }
  
  // If data fetching is complete but there's no data, show nothing.
  if (!postData) {
      return null;
  }
  
  return (
    // Navbar is gone.
    <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg mb-4">
        <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight text-center">
          Here are your generated posts!
        </h1>
      </div>
      {/* Pass the fetched data and form params to the display component */}
      <ResultsDisplay post={postData} formParams={formParams} />
    </main>
  );
}