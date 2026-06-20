'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export function ClientGreeting() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.healthCheck.queryOptions());
  return (
    <div className='flex flex-col gap-3 items-center justify-center border-2 p-5 borderblack'>
      <div className='font-medium text-2xl'>tRPC status: </div>
      <div className='font-bold text-2xl'>✅{data.status}</div>
    </div>
  )
}