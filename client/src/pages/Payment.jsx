import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CopyText from "../components/CopyText";
import { useAuth } from "@clerk/clerk-react";


const API_URL = import.meta.env.VITE_API_URL;

const Payment = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getToken } = useAuth();

    const [utr, setUtr] = useState("");
    const [screenshot, setScreenshot] = useState(null);
    const [loading, setLoading] = useState(false);

    const utrRegex = /^[0-9]{10,22}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!utr) {
            toast.error("UTR is required");
            return;
        }

        if (!utrRegex.test(utr.trim())) {
            toast.error("UTR must be a 10–22 digit number");
            return;
        }

        setLoading(true);

        const token = await getToken(); // 🔥 THIS IS THE FIX

        const formData = new FormData();
        formData.append("utr", utr.trim());
        if (screenshot) formData.append("screenshot", screenshot);

        try {
            const res = await fetch(
                `${API_URL}/api/payments/manual/${id}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Payment failed");
                return;
            }

            toast.success("Payment submitted. Status: Pending");
            navigate("/success?page=payment");
        } catch {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="h-screen mt-20 flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-xl p-8 max-w-sm md:max-w-lg w-full"
            >
                <h2 className="text-2xl font-bold text-center mb-6">
                    Payment Details
                </h2>

                {/* Payment Method */}
                <div className="mb-4">
                    <label className="font-semibold">Payment Method</label>
                    <input
                        type="text"
                        value="UPI"
                        disabled
                        className="w-full border p-2 rounded bg-gray-100 mt-1 cursor-no-drop"
                    />
                </div>

                {/* UPI Instructions */}
                <div className="mb-4 flex flex-col md:flex-row gap-3 items-center text-sm bg-blue-50 p-3 rounded">
                    <div >
                        <p className="font-semibold mb-1">Pay using UPI</p>
                        <img src="/paymentQR.png" alt="paymentQR" className="h-30" />
                    </div>
                    <div>

                        <p className="flex items-center gap-1">
                            UPI ID:
                        </p>
                        <CopyText text="QR917010931030-1875@unionbankofindia" />

                        <p>
                            Amount: <b>₹200</b>
                        </p>

                        <p className="text-xs text-gray-600 mt-1">
                            After payment, enter UTR below and upload screenshot
                        </p>
                    </div>
                </div>

                {/* UTR */}
                <div className="mb-4">
                    <label className="font-semibold">
                        UTR / Transaction ID
                    </label>
                    <input
                        type="text"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                        placeholder="Enter UTR number"
                        className="w-full border p-2 rounded mt-1"
                        required
                    />
                </div>

                {/* Screenshot */}
                <div className="mb-4">
                    <label className="font-semibold">
                        Upload Payment Screenshot (jpg / png)
                    </label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => setScreenshot(e.target.files[0])}
                        className="w-full border p-2 rounded mt-1"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded text-white ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-800"
                        }`}
                >
                    {loading ? "Submitting..." : "Submit Payment"}
                </button>
                
            </form>
        </div>
    );
};

export default Payment;
