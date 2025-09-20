import { Suspense } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { AlertTriangle } from 'lucide-react';

import {
  generateSocialMediaPost,
  GenerateSocialMediaPostInput,
} from '@/ai/flows/generate-social-media-post';
import ResultsDisplay from './results-display';
import ResultsLoading from './loading';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tones = ['Promotional', 'Festive', 'Funny', 'Formal'] as const;
const languages = ['English', 'Tamil', 'Hindi'] as const;

const searchParamsSchema = z.object({
  productDescription: z.string().optional(),
  language: z.enum(languages).optional(),
  tone: z.enum(tones).optional(),
});

type PostGeneratorProps = {
  params: GenerateSocialMediaPostInput;
};

async function PostGenerator({ params }: PostGeneratorProps) {
  try {
    const post = await generateSocialMediaPost(params);
    return <ResultsDisplay post={post} formParams={params} />;
  } catch (error) {
    console.error(error);
    return (
      <div className="w-full max-w-md text-center mt-12">
        <Card className="w-full max-w-md text-center bg-card/50 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertTriangle className="text-destructive" />
              Generation Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              An error occurred while generating your post. Please try again.
            </p>
            <Button asChild className="mt-4">
              <Link href="/">Start Over</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default function ResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const validation = searchParamsSchema.safeParse(searchParams);

  if (
    !validation.success ||
    !validation.data.productDescription ||
    !validation.data.language ||
    !validation.data.tone
  ) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md text-center bg-card/50 backdrop-blur-lg border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <AlertTriangle className="text-destructive" />
                Invalid Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The post generation request was invalid. Please go back and try
                again.
              </p>
              <Button asChild className="mt-4">
                <Link href="/">Start Over</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const generationParams = {
    productDescription: validation.data.productDescription,
    language: validation.data.language,
    tone: validation.data.tone,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg">
            <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight text-center">
            Here is Your Generated Post!
            </h1>
        </div>
        <Suspense fallback={<ResultsLoading />}>
          <PostGenerator params={generationParams} />
        </Suspense>
      </main>
    </div>
  );
}
