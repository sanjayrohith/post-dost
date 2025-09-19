'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Wand2 } from 'lucide-react';
import { SuggestionCards } from '@/components/suggestion-cards';

const tones = ['Promotional', 'Festive', 'Funny', 'Formal'] as const;
const languages = ['English', 'Tamil', 'Hindi'] as const;

const formSchema = z.object({
  productDescription: z.string().min(10, {
    message: 'Please describe your product or offer in at least 10 characters.',
  }),
  language: z.enum(languages),
  tone: z.enum(tones),
});

type FormValues = z.infer<typeof formSchema>;

export function GeneratorForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDescription: '',
      language: 'English',
      tone: 'Promotional',
    },
  });

  function onSubmit(values: FormValues) {
    const params = new URLSearchParams({
      productDescription: values.productDescription,
      language: values.language,
      tone: values.tone,
    });
    router.push(`/results?${params.toString()}`);
  }

  const handleSuggestionClick = (prompt: string) => {
    form.setValue('productDescription', prompt);
  };

  return (
    <>
      <div className="w-full max-w-xl mt-12 bg-black/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productDescription"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="text-primary font-semibold">
                    DESCRIBE YOUR PRODUCT
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Special Masala Dosa at my tiffen hotel in Malayambakkam'"
                      className="min-h-[100px] rounded-lg text-base bg-zinc-900/60 border-white/20 placeholder:text-muted-foreground/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-primary font-semibold">
                      SELECT LANGUAGE
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-lg bg-zinc-900/60 border-white/20">
                          <SelectValue placeholder="Choose language..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-primary font-semibold">
                      CHOOSE TONE
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {tones.map(tone => (
                          <Button
                            key={tone}
                            type="button"
                            variant={
                              field.value === tone ? 'secondary' : 'outline'
                            }
                            onClick={() => field.onChange(tone)}
                            className="rounded-full transition-transform transform hover:scale-105 bg-zinc-800/60 border-white/20"
                          >
                            {tone}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-lg font-bold rounded-lg transition-transform transform hover:scale-105 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Wand2 className="mr-2" />
              Generate Post
            </Button>
          </form>
        </Form>
      </div>
      <SuggestionCards onSuggestionClick={handleSuggestionClick} />
    </>
  );
}
