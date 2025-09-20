'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ClipboardCopy,
  Download,
  RefreshCw,
  Home,
  Music4,
  LoaderCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type {
  GenerateSocialMediaPostOutput,
  GenerateSocialMediaPostInput,
} from '@/ai/flows/generate-social-media-post';
import { Card, CardContent } from '@/components/ui/card';

type ResultsDisplayProps = {
  post: GenerateSocialMediaPostOutput;
  formParams: GenerateSocialMediaPostInput;
};

export default function ResultsDisplay({ post, formParams }: ResultsDisplayProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(post.caption);
    toast({
      title: 'Copied to clipboard!',
      description: 'The post caption has been copied.',
    });
  };

  const handleGenerateAgain = () => {
    const params = new URLSearchParams({
      ...formParams,
      rerun: Math.random().toString(),
    });
    router.push(`/results?${params.toString()}`);
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    setAudioUrl(null);
    setAudioError(null);
    // Placeholder: feature removed
    setTimeout(() => {
      setIsGeneratingAudio(false);
      setAudioError('Audio generation feature no longer available.');
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl mt-12 space-y-8">
      <Card className="bg-card/50 backdrop-blur-lg border border-white/10">
        <CardContent className="p-4 md:p-6">
          <div className="aspect-square w-full overflow-hidden rounded-lg border">
            <Image
              src={post.imageUrl}
              alt="Generated social media post image"
              width={800}
              height={800}
              className="object-cover w-full h-full"
              data-ai-hint="social media marketing"
            />
          </div>
          <Button asChild variant="outline" className="w-full mt-4 rounded-lg">
            <a href={post.imageUrl} download="post-dost-image.png">
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-lg border border-white/10">
        <CardContent className="p-4 md:p-6">
          <div className="relative">
            <p className="text-base bg-muted/50 p-4 rounded-lg min-h-[150px] whitespace-pre-wrap">
              {post.caption}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyCaption}
              className="absolute top-2 right-2 h-8 w-8"
              aria-label="Copy caption"
            >
              <ClipboardCopy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-lg border border-white/10">
        <CardContent className="p-4 md:p-6 text-center">
          <h3 className="text-lg font-semibold text-primary mb-4">Audio (Removed)</h3>
          {!audioUrl && !isGeneratingAudio && (
            <Button onClick={handleGenerateAudio} size="lg" className="rounded-lg">
              <Music4 className="mr-2" />
              Generate Audio
            </Button>
          )}
          {isGeneratingAudio && (
            <div className="flex justify-center items-center p-4">
              <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
              <p className="ml-4 text-muted-foreground">Generating audio...</p>
            </div>
          )}
          {audioError && <p className="text-destructive mt-4">{audioError}</p>}
          {audioUrl && (
            <div className="mt-4 space-y-4">
              <audio controls src={audioUrl} className="w-full">
                Your browser does not support the audio element.
              </audio>
               <Button onClick={handleGenerateAudio} variant="outline" size="sm" className="rounded-lg">
                <RefreshCw className="mr-2" />
                Regenerate
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleGenerateAgain}
          size="lg"
          className="flex-1 text-lg rounded-lg"
        >
          <RefreshCw className="mr-2" />
          Generate Again
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="flex-1 text-lg rounded-lg"
        >
          <Link href="/">
            <Home className="mr-2" />
            Start Over
          </Link>
        </Button>
      </div>
    </div>
  );
}
