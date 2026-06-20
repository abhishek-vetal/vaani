import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { ClientGreeting } from './client-greeting';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function TestPage() {
  prefetch(trpc.healthCheck.queryOptions());

  return (
    <HydrateClient>
      <div className='flex flex-col items-center justify-center font-bold text-3xl p-7 gap-4'>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            tRPC Test Page
            <ClientGreeting />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}