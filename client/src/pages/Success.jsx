import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Success = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
            <CheckCircle size={80} className="text-green-600 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Registration Successful 🎉</h1>
            <p className="text-gray-600 mb-6">
                Your event registration has been submitted successfully.
            </p>

            <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded"
            >
                Go Home
            </button>
        </div>
    );
};

export default Success;
