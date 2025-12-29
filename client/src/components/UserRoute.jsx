import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
    const { isLoaded, isSignedIn } = useUser();

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    return children;
};

export default UserRoute;
