import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Payment = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const [utr, setUtr] = useState("");
    const [screenshot, setScreenshot] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!utr) {
            alert("UTR required");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("utr", utr);
        if (screenshot) {
            formData.append("screenshot", screenshot);
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/payments/manual/${id}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();

            if (data.success) {
                toast.success("Payment submitted. Status: Pending");
                navigate("/success");
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full"
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
                        className="w-full border p-2 rounded bg-gray-100 mt-1"
                    />
                </div>

                {/* UPI Instructions */}
                <div className="mb-4 text-sm bg-blue-50 p-3 rounded">
                    <p className="font-semibold mb-1">Pay using UPI</p>
                    <p>UPI ID: <b>ilavenil26@upi</b></p>
                    <p>Amount: <b>₹200</b></p>
                    <p className="text-xs text-gray-600 mt-1">
                        After payment, enter UTR below
                    </p>
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
