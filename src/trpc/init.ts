import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson  from 'superjson';

/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createTRPCContext = async (opts: { headers: Headers }) => {
  // const user = await auth(opts.headers);
  return {};
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
  });

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// Authenticated procedure - requires userId
export const authProcedure = t.procedure.use(async ({ next }) => {
  const { userId } = await auth()

  if(!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED"})
  }

  return next({
    ctx: { userId }
  })
})

// Organization procedure - requires userId and orgId
export const orgProcedure = t.procedure.use(async ({ next }) => {
  const { userId, orgId } = await auth()
  
  if(!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED"})
  }

  if(!orgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Organization Required"
    })
  }

  return next({
    ctx: {userId, orgId}
  })
})
