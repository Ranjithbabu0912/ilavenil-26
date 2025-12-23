import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Success = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const page = searchParams.get("page");          // register | payment
    const registrationId = searchParams.get("rid"); // payment page id

    const isPayment = page === "payment";

    const handleAction = () => {
        if (isPayment) {
            navigate("/"); // 🏠 Go Home
        } else {
            if (!registrationId) {
                alert("Registration ID missing");
                return;
            }
            navigate(`/payment/${registrationId}`); 
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
            <CheckCircle size={80} className="text-green-600 mb-4" />

            <h1 className="text-3xl font-bold mb-2">
                {isPayment ? "Payment Submitted ✅" : "Registration Successful 🎉"}
            </h1>

            <p className="text-gray-600 mb-6">
                {isPayment
                    ? "Your payment proof has been submitted. Please wait for confirmation."
                    : "Your registration was successful. Please proceed to payment to complete the process."}
            </p>

            <button
                onClick={handleAction}
                className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded flex items-center gap-2"
            >
                {isPayment ? "Go Home" : "Proceed Payment"}
                <ArrowRight />
            </button>

            {isPayment && (
                <p className="text-xs mt-10 text-gray-500">
                    (You can check your registration status using the check status button or you will be contacted by our team.)
                </p>
            )}
        </div>
    );
};

export default Success;
