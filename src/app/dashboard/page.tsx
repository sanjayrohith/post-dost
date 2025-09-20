'use client';

import { withAuth } from '@/components/with-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome, {user?.name}!</p>
          <p>This is a protected page that requires authentication.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(Dashboard);