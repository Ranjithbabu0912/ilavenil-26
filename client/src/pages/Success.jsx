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

    const SUPPORT_EMAIL = "help.ilavenil26@gmail.com"; 
    const SUPPORT_WHATSAPP = "919043100583"; 


    return (
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
            <CheckCircle size={80} className="text-green-600 mb-4" />

            <h1 className="text-3xl font-bold mb-2">
                {isPayment ? "Payment Submitted Successfully ✅" : "Registration Successful 🎉"}
            </h1>

            <p className="text-gray-600 mb-6 w-70 md:w-xl lg:w-3xl">
                {isPayment
                    ? "Your payment proof has been submitted successfully. Verification will be completed within 24 hours. If verification is not completed within this time, please contact our support team."
                    : "Your registration was successful. Please proceed to payment to complete the process."}
            </p>

            <button
                onClick={handleAction}
                className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded flex items-center gap-2"
            >
                {isPayment ? "Go Home" : "Proceed to Payment"}
                <ArrowRight />
            </button>

            {isPayment && (
                <div className="mt-6 text-sm text-gray-600 space-y-2 max-w-md">
                    <p>
                        📧 Email:{" "}
                        <a
                            href={`mailto:${SUPPORT_EMAIL}`}
                            className="text-blue-600 hover:underline"
                        >
                            {SUPPORT_EMAIL}
                        </a>
                    </p>

                    <p>
                        📱 WhatsApp:{" "}
                        <a
                            href={`https://wa.me/${SUPPORT_WHATSAPP}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-green-600 hover:underline"
                        >
                            Chat on WhatsApp
                        </a>
                    </p>
                </div>
            )}

        </div>
    );
};

export default Success;
