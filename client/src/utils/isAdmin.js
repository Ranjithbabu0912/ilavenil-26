export const isAdminUser = (user) =>
  user?.publicMetadata?.role === "admin";
