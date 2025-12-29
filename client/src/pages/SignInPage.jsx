import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
    return (
        <div className="flex justify-center mt-10 items-center min-h-screen">
            <SignIn routing="path" path="/sign-in" />
        </div>
    );
};

export default SignInPage;
