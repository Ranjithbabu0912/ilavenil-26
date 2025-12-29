import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

/**
 * Real Clerk authentication middleware
 * Uses the default Clerk session cookie
 */
export const clerkProtect = ClerkExpressWithAuth();
