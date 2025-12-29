import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AdminRoute = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  if (user?.publicMetadata?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminRoute;
