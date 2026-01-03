import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CheckStatusModal = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [registrationId, setRegistrationId] = useState(null);

    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    /* 🔹 Auto-fill email */
    useEffect(() => {
        if (!isLoaded) return;
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (userEmail) setEmail(userEmail);
    }, [isLoaded, user]);

    /* 🔹 Check status */
    const handleCheck = async () => {
        if (!email) {
            toast.error("Email not available");
            return;
        }

        setLoading(true);
        setStatus(null);
        setReason("");

        try {
            const res = await fetch(`${API_URL}/api/events/check-status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                setStatus(data.status?.toUpperCase());
                setRegistrationId(data.registrationId);
                if (data.status === "REJECTED") {
                    setReason(data.rejectionReason || "Payment verification failed");
                }
            } else {
                toast.error(data.message || "No registration found");
            }
        } catch {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    const statusMeta = {
        NOT_PAID: ["text-yellow-600", "Payment not completed"],
        PENDING: ["text-yellow-600", "Please wait for confirmation"],
        APPROVED: ["text-green-600", "Payment approved"],
        REJECTED: ["text-red-600", ""],
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg w-80 shadow-2xl relative">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                    <X />
                </button>

                <h2 className="text-xl font-bold mb-4 text-center">
                    Check Payment Status
                </h2>

                {/* Email (readonly) */}
                <input
                    type="email"
                    value={email}
                    disabled
                    className="border p-2 w-full mb-3 rounded bg-gray-100 cursor-not-allowed"
                />

                <button
                    onClick={handleCheck}
                    disabled={loading}
                    className="bg-blue-600 text-white w-full py-2 rounded"
                >
                    {loading ? "Checking..." : "Check Status"}
                </button>

                {/* STATUS RESULT */}
                {status && (
                    <div className="mt-4 text-center">
                        <p className="font-semibold">
                            Status:
                            <span className={`ml-2 ${statusMeta[status][0]}`}>
                                {status}
                            </span>
                        </p>


                        {/* ❌ REJECTED */}
                        {status === "REJECTED" && (
                            <>
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                                    <b>Reason:</b> {reason}
                                </div>

                                <button
                                    onClick={() => navigate(`/payment/${registrationId}`)}
                                    className="mt-3 bg-red-600 text-white w-full py-2 rounded"
                                >
                                    Retry Payment
                                </button>
                            </>
                        )}

                        {/* ⏳ PENDING */}
                        {status === "PENDING" && (
                            <p className="text-xs mt-3 text-gray-500">
                                Please wait. Admin verification in progress.
                            </p>
                        )}

                        {/* ✅ APPROVED */}
                        {status === "APPROVED" && (
                            <button
                                onClick={() => navigate("/my-qr")}
                                className="bg-green-600 mt-3 text-white w-full py-2 rounded"
                            >
                                Download QR
                            </button>
                        )}

                        {/* ⚠️ NOT PAID */}
                        {status === "NOT_PAID" && (
                            <button
                                onClick={() => navigate("/payment")}
                                className="bg-yellow-500 mt-3 text-white w-full py-2 rounded"
                            >
                                Proceed to Payment
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckStatusModal;
