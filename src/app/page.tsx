import { GeneratorForm } from '@/app/generator-form';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary animate-text-glow">
          AI-Powered Social Media Posts in Seconds
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
          Generate culturally-aware posts with images for your local business.
        </p>
        <Badge
          variant="outline"
          className="mt-6 gap-2 border-primary/50 bg-primary/10 text-primary"
        >
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered</span>
        </Badge>
        <GeneratorForm />
      </main>
    </div>
  );
}
