import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import QRCode from "react-qr-code";
import StyledQR from './styledQR'

const MyQR = () => {
    const { getToken } = useAuth();
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const qrRef = useRef(null);

    useEffect(() => {
        const fetchRegistration = async () => {
            try {
                const token = await getToken();
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/my-registration`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();
                setRegistration(data);
            } catch (err) {
                console.error("Failed to fetch registration");
            } finally {
                setLoading(false);
            }
        };

        fetchRegistration();
    }, []);

    // ⏳ Loading
    if (loading) {
        return (
            <div className="text-center min-h-screen flex items-center justify-center text-gray-500">
                Loading QR…
            </div>
        );
    }

    // ❌ No registration
    if (!registration) {
        return (
            <div className="text-center min-h-screen flex items-center justify-center text-red-500">
                No registration found
            </div>
        );
    }

    // ⛔ Payment not approved
    if (registration.payment?.status !== "APPROVED") {
        return (
            <div className="text-center flex flex-col min-h-screen justify-center text-gray-600">
                ⚠️ QR code will be available after payment approval
            </div>
        );
    }

    // ✅ Payment approved
    const qrUrl = `${import.meta.env.VITE_FRONTEND_URL}/scan/${registration.qrToken}`;

    const downloadQR = () => {
        const svg = qrRef.current.querySelector("svg");
        const svgData = new XMLSerializer().serializeToString(svg);

        const qrImg = new Image();
        const logoImg = new Image();

        qrImg.onload = () => {
            logoImg.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // A6 @300 DPI
                canvas.width = 1240;
                canvas.height = 1748;

                // Background
                ctx.fillStyle = "#0f172a";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Card
                ctx.fillStyle = "#ffffff";
                ctx.roundRect(60, 60, 1120, 1628, 40);
                ctx.fill();

                // Header
                ctx.fillStyle = "#1e40af";
                ctx.fillRect(60, 60, 1120, 180);

                ctx.fillStyle = "#fff";
                ctx.font = "bold 48px Arial";
                ctx.textAlign = "center";
                ctx.fillText("ILAVENIL'26", canvas.width / 2, 165);

                ctx.font = "24px Arial";
                ctx.fillText("Inter-Collegiate Meet", canvas.width / 2, 210);

                // Name
                ctx.fillStyle = "#000";
                ctx.font = "bold 42px Arial";
                ctx.fillText(
                    registration.name.toUpperCase(),
                    canvas.width / 2,
                    330
                );

               

                // QR Code (front)
                ctx.drawImage(qrImg, 370, 430, 500, 500);
                
                
                // Divider
                ctx.strokeStyle = "#e5e7eb";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(160, 1060);
                ctx.lineTo(1080, 1060);
                ctx.stroke();

                // Footer
                ctx.font = "26px Arial";
                ctx.fillStyle = "#6b7280";
                ctx.fillText(
                    "Show this ID at the event entrance",
                    canvas.width / 2,
                    1100
                );

                ctx.font = "22px Arial";
                ctx.fillText(
                    "This ID is non-transferable",
                    canvas.width / 2,
                    1145
                );

                // Download
                const link = document.createElement("a");
                link.download = `ILAVENIL26_ID_${registration._id}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            };

            logoImg.src = "/event-logo.png";
        };

        qrImg.src =
            "data:image/svg+xml;base64," +
            btoa(unescape(encodeURIComponent(svgData)));
    };




    return (
        <div className="flex flex-col min-h-screen justify-center items-center gap-4">
            <h1 className="text-xl logo-text">ILAVENIL'26</h1>

            <div ref={qrRef} className="bg-white p-4 rounded shadow">
                {/* <QRCode value={qrUrl} size={220} /> */}

                <StyledQR data={qrUrl}/>
            </div>

            <button
                onClick={downloadQR}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                ⬇ Download QR
            </button>

            <p className="text-sm text-gray-500 text-center max-w-xs">
                Your payment is verified. Download and show this QR at the event entrance.
            </p>
        </div>
    );
};

export default MyQR;
