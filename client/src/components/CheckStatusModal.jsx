import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CheckStatusModal = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user, isLoaded } = useUser();

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    // Auto-fill email from logged-in user
    useEffect(() => {
        if (!isLoaded) return;

        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (userEmail) {
            setEmail(userEmail);
        }
    }, [isLoaded, user]);

    const handleCheck = async () => {
        if (!email) {
            toast.error("Email not available");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${API_URL}/api/events/check-status`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await res.json();

            if (data.success) {
                setStatus(data.status?.trim().toUpperCase());
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    const statusColor = {
        NOT_PAID: ["text-yellow-600", "You didn't pay"],
        PENDING: ["text-yellow-600", "Wait for confirmation"],
        REJECTED: ["text-red-600", "Contact support"],
        APPROVED: ["text-green-600", "Check your email"],
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
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

                {/* Email shown but NOT editable */}
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

                {status && (
                    <div>
                        <p className="mt-4 text-center font-semibold">
                            Status:
                            <span className={`ml-2 ${statusColor[status][0]}`}>
                                {status}
                            </span>
                        </p>
                        <p className="text-center text-xs mt-2">
                            {statusColor[status][1]}
                        </p>
                        {
                            status === "APPROVED" ? (
                                <button
                                    onClick={() => navigate('/my-qr')}
                                    className="bg-blue-600 mt-2 text-white w-full py-2 rounded cursor-pointer"
                                >
                                    Download QR
                                </button>
                            ) : ""
                        }
                    </div>
                )}

            </div>
        </div>
    );
};

export default CheckStatusModal;
