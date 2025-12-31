import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";


/* 🔊 Sound files (put these in /public folder) */
const successSound = new Audio("/success.mp3");
const errorSound = new Audio("/error.mp3");

/* 📳 Vibration helper */
const vibrate = (pattern = [200]) => {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};

const AdminQRScanner = () => {
    const { getToken } = useAuth();
    const { user } = useUser();
    const scannerRef = useRef(null);

    const [participant, setParticipant] = useState(null);
    const [alreadyMarked, setAlreadyMarked] = useState(false);
    const [markedStatus, setMarkedStatus] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [scanLocked, setScanLocked] = useState(false);

    /* 🔹 Initialize QR Scanner */
    useEffect(() => {
        scannerRef.current = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 5,                 // 🔥 Lower FPS for mobile safety
                qrbox: 250,
                rememberLastUsedCamera: true,
            },
            false
        );

        scannerRef.current.render(onScanSuccess, onScanError);

        return () => {
            scannerRef.current?.clear().catch(() => { });
        };
        // eslint-disable-next-line
    }, []);

    /* ❌ Ignore scan errors */
    const onScanError = () => { };

    /* 🔹 Handle QR Scan */
    const onScanSuccess = async (decodedText) => {
        if (scanLocked) return;      // 🔥 STOP MULTI-SCAN
        setScanLocked(true);

        try {
            setMessage("");
            setParticipant(null);
            setAlreadyMarked(false);

            const qrToken = decodedText.split("/").pop();

            const adminToken = await getToken({
                template: "admin-template",
            });

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/attendance/scan/${qrToken}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                errorSound.play();
                vibrate([300, 100, 300]);
                setMessage(data.message || "Scan failed");
                setScanLocked(false);
                return;
            }

            successSound.play();
            vibrate([200, 100, 200]);

            if (data.alreadyMarked) {
                setParticipant(data.participant);
                setAlreadyMarked(true);
                setMarkedStatus(data.status);
                setMessage("Attendance already marked");
            } else {
                setParticipant(data.participant);
                setAlreadyMarked(false);
            }

            // 🔓 Allow next scan after delay
            setTimeout(() => setScanLocked(false), 4000);

        } catch (err) {
            console.error(err);
            errorSound.play();
            vibrate([400]);
            setMessage("Unable to scan QR");
            setScanLocked(false);
        }
    };

    /* 🔹 Manual Attendance Mark */
    const markAttendance = async (status) => {
        if (!participant || loading) return;


        const adminName =
            user?.fullName ||
            user?.username ||
            user?.primaryEmailAddress?.emailAddress ||
            "Admin";



        try {
            setLoading(true);

            const adminToken = await getToken({
                template: "admin-template",
            });

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/attendance`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        registrationId: participant.registrationId,
                        name: participant.name,
                        email: participant.email,
                        event: participant.event,
                        status,
                        markedBy: adminName,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                errorSound.play();
                vibrate([300, 100, 300]);
                setMessage(data.message || "Failed to mark attendance");
                return;
            }

            successSound.play();
            vibrate([200, 100, 200]);

            toast.success(`Marked ${status} by ${adminName}`);
            setMessage(`Marked ${status} by ${adminName}`);
            setParticipant(null);
            setAlreadyMarked(false);

        } catch (err) {
            console.error(err);
            errorSound.play();
            vibrate([400]);
            setMessage("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto md:mt-24 p-4">
            <h1 className="text-2xl font-bold text-center mb-4">
                Admin Attendance Scanner
            </h1>

            {/* 🔍 QR Scanner */}
            <div id="qr-reader" className="border rounded mb-4" />

            {/* 👤 Participant Card */}
            {participant && (
                <div className="bg-white shadow rounded p-4">
                    <h3 className="font-semibold">{participant.name}</h3>
                    <p className="text-sm">{participant.email}</p>
                    <p className="text-sm">Event: {participant.event}</p>

                    {alreadyMarked ? (
                        <p
                            className={`mt-3 font-semibold ${markedStatus === "PRESENT"
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                        >
                            Already marked: {markedStatus}
                        </p>
                    ) : (
                        <div className="flex gap-3 mt-4">
                            <button
                                disabled={loading}
                                onClick={() => markAttendance("PRESENT")}
                                className="flex-1 bg-green-600 cursor-pointer text-white py-2 rounded disabled:opacity-50"
                            >
                                Present
                            </button>

                            <button
                                disabled={loading}
                                onClick={() => markAttendance("ABSENT")}
                                className="flex-1 bg-red-600 cursor-pointer text-white py-2 rounded disabled:opacity-50"
                            >
                                Absent
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ℹ️ Message */}
            {message && (
                <p className="mt-4 text-center font-semibold text-indigo-600">
                    {message}
                </p>
            )}
        </div>
    );
};

export default AdminQRScanner;
