import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const CheckStatusModal = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        if (!email) {
            toast.error("Enter registered email");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                "http://localhost:5000/api/events/check-status", // ✅ FIXED
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await res.json();

            if (data.success) {
                setStatus(data.status?.trim().toUpperCase()); // ✅ FIXED
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
        PENDING: ["text-yellow-600", "Wait for a conformation"],
        REJECTED: ["text-red-600", "Contact support"],
        APPROVED: ["text-green-600", "Check your email"],
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg w-80 shadow-2xl relative">

                <button
                    onClick={onClose}
                    className="text-sm text-gray-500 mb-4 block hover:underline cursor-pointer"
                >
                    <X />
                </button>


                <h2 className="text-xl font-bold mb-4 text-center">
                    Check Payment Status
                </h2>

                <input
                    type="email"
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-3 rounded"
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
                    </div>
                )}

            </div>
        </div>
    );
};

export default CheckStatusModal;
