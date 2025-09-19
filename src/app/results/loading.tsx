import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function ResultsLoading() {
  return (
    <div className="w-full max-w-2xl mt-12 space-y-8">
      <Card>
        <CardContent className="p-4 space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-md self-end" />
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
      </div>
    </div>
  );
}
