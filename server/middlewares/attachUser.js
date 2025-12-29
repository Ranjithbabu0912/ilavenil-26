import { clerkClient } from "@clerk/clerk-sdk-node";

export const attachUser = async (req, res, next) => {


  if (!req.auth?.userId) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const user = await clerkClient.users.getUser(req.auth.userId);

  req.user = {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    role: user.publicMetadata?.role || "user",
  };

  next();
};
