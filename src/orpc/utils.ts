import { db } from "@/db";
import { User } from "@/db/schema";
import { SessionValidationResult, validateSessionToken } from "@/lib/auth";
import { ORPCError, os } from "@orpc/server";
import { getCookie } from "@tanstack/react-start/server";

type OSContext = {
  db?: typeof db;
  user?: User | null
}
const baseMiddleware = os.$context<OSContext>().middleware(async ({next}) => {
  const sessionToken = getCookie("sessionToken");
  let session: SessionValidationResult = {
    session: null,
    user: null
  };
  if (sessionToken) {
    session = await validateSessionToken(sessionToken);
  }

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
  }

  return next({
    context: {
      db,
      user: session.user
    }
  })
})

export const baseProcedure = os.use(baseMiddleware);
export const authProcedure = baseProcedure.use(({next, context}) => {
  if (!context.user) {
    throw new ORPCError('UNAUTHORIZED');
  }

  return next({context: {
    ...context,
    user: context.user
  }})
})