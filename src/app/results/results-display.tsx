// src/app/results/results-display.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ClipboardCopy, Download, RefreshCw, Home, Music4, LoaderCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface ResultsDisplayProps {
  post: {
    captions: { caption: string; hashtags: string; }[];
    imageUrl?: string | null;
  };
  formParams: {
    productDescription: string;
    language: string;
    tone: string;
  };
}

export default function ResultsDisplay({ post, formParams }: ResultsDisplayProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: 'Copied to clipboard!',
    });
    // Optional: reset the copied state after a few seconds
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerateAgain = () => {
    const params = new URLSearchParams({ ...formParams, rerun: Math.random().toString() });
    router.push(`/results?${params.toString()}`);
  };

  const handleGenerateAudio = async () => {
    const captionToUse = post.captions[0]?.caption;
    if (!captionToUse) return;

    setIsGeneratingAudio(true);
    setAudioUrl(null);
    setAudioError(null);
    try {
      // This assumes you have an API route at /api/generate-audio
      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: captionToUse, language: formParams.language }),
      });
      if (!res.ok) throw new Error('Failed to generate audio');
      const data = await res.json();
      setAudioUrl(data.audioUrl);
    } catch (err) {
      setAudioError('Failed to generate audio. Please try again.');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mt-12 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image */}
        <div className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-lg border border-white/10">
            <CardContent className="p-4">
              <div className="aspect-square w-full overflow-hidden rounded-lg border flex items-center justify-center bg-zinc-900">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt="Generated post image"
                    width={1024}
                    height={1024}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                    <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
                    <p className="font-semibold">Image Generation Failed</p>
                    <p className="text-sm">But your captions are ready!</p>
                  </div>
                )}
              </div>
              {post.imageUrl && (
                <Button asChild variant="outline" className="w-full mt-4 rounded-lg">
                  <a href={post.imageUrl} download="post-dost-image.png">
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Captions & Audio */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Generated Captions</h2>
          {post.captions?.map((item, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-lg border border-white/10">
              <CardContent className="p-4 relative">
                <p className="text-base whitespace-pre-wrap pr-10">{item.caption}</p>
                <p className="mt-3 text-sm text-blue-400 font-mono">{item.hashtags}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(item.caption + "\n" + item.hashtags, index)}
                  className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-white"
                >
                  <ClipboardCopy className={`h-5 w-5 transition-colors ${copiedIndex === index ? 'text-green-500' : ''}`} />
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Audio Card */}
          <Card className="bg-card/50 backdrop-blur-lg border border-white/10 mt-6">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-primary mb-4">Make it Audio!</h3>
              {!audioUrl && !isGeneratingAudio && (
                <Button onClick={handleGenerateAudio} size="lg" className="rounded-lg">
                  <Music4 className="mr-2" />
                  Generate Audio from First Caption
                </Button>
              )}
              {isGeneratingAudio && (
                <div className="flex justify-center items-center p-4">
                  <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
                  <p className="ml-4 text-muted-foreground">Generating...</p>
                </div>
              )}
              {audioError && <p className="text-destructive mt-4">{audioError}</p>}
              {audioUrl && (
                <div className="mt-4 space-y-4">
                  <audio controls src={audioUrl} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
        <Button onClick={handleGenerateAgain} size="lg" className="flex-1 text-lg rounded-lg">
          <RefreshCw className="mr-2" />
          Generate Again
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1 text-lg rounded-lg">
          <Link href="/">
            <Home className="mr-2" />
            Start Over
          </Link>
        </Button>
      </div>
    </div>
  );
}