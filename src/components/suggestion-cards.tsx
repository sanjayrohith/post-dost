'use client';

import Image, { type StaticImageData } from 'next/image';
import diwaliSugcard from '../../diwali_sugcard.jpg';
import newyearSugcard from '../../newyear_sugcard.jpg';
import pongalSugcard from '../../pongal_sugcard.webp';

type Suggestion = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | StaticImageData;
  imageHint: string;
  prompt: string;
};

const suggestions: Suggestion[] = [
  {
    id: 'diwali',
    title: 'Generate Diwali Post',
    description: 'Click to auto-fill',
  imageUrl: diwaliSugcard,
    imageHint: 'diwali lamp',
    prompt: 'A festive Diwali offer on all our products!',
  },
  {
    id: 'new-year',
    title: "Create a New Year's Greeting",
    description: 'Click to auto-fill',
  imageUrl: newyearSugcard,
    imageHint: 'new year fireworks',
    prompt: "A happy New Year's greeting to all our customers!",
  },
  {
    id: 'pongal',
    title: 'Make a Pongal Offer',
    description: 'Click to auto-fill',
  imageUrl: pongalSugcard,
    imageHint: 'pongal festival',
    prompt: 'A special Pongal offer for our valued customers!',
  },
];

export function SuggestionCards({
  onSuggestionClickAction,
}: {
  onSuggestionClickAction: (prompt: string) => void;
}) {
  const handleSuggestionClick = onSuggestionClickAction;
  return (
    <div className="w-full max-w-4xl mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map(suggestion => (
          <button
            type="button"
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion.prompt)}
            className="relative group overflow-hidden rounded-2xl border border-white/10 aspect-[4/2.5] text-white text-center flex flex-col justify-center items-center p-4 transition-all duration-300 hover:scale-105"
          >
            <Image
              src={suggestion.imageUrl}
              alt={suggestion.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              data-ai-hint={suggestion.imageHint}
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-primary">
                {suggestion.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {suggestion.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}