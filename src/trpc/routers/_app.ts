import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  healthCheck: baseProcedure
  .query(() => {
    // throw new Error("some error happened")
    return {status: "ok", code: 500}
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;