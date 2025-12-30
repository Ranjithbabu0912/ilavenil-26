import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { isAdminUser } from "../utils/isAdmin";

const ProtectedRoute = ({ children }) => {
    const { user, isSignedIn, isLoaded } = useUser();

    if (!isLoaded) return null;
    if (!isSignedIn) return <Navigate to="/sign-in" replace />;

    // 🔥 BLOCK ADMIN FROM USER FLOWS
    if (isAdminUser(user)) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
