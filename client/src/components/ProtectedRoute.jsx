import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useUser();

    if (!isLoaded) return null; // or loading spinner

    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    return children;
};

export default ProtectedRoute;
