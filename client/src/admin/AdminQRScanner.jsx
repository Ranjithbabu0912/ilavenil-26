import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const AdminQRScanner = () => {
    const { getToken } = useAuth();

    const [participant, setParticipant] = useState(null);
    const [alreadyMarked, setAlreadyMarked] = useState(false);
    const [markedStatus, setMarkedStatus] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔹 Initialize QR Scanner
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: 250,
                rememberLastUsedCamera: true,
            },
            false
        );

        scanner.render(onScanSuccess, () => { });

        return () => {
            scanner.clear().catch(() => { });
        };
    }, []);

    // 🔹 Handle QR Scan
    const onScanSuccess = async (decodedText) => {
        try {
            setMessage("");
            setParticipant(null);

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
                setMessage(data.message || "Scan failed");
                return;
            }

            if (data.alreadyMarked) {
                setParticipant(data.participant);
                setAlreadyMarked(true);
                setMarkedStatus(data.status);
                setMessage("Attendance already marked");
            } else {
                setParticipant(data.participant);
                setAlreadyMarked(false);
                setMarkedStatus("");
            }
        } catch (err) {
            console.error(err);
            setMessage("Unable to scan QR");
        }
    };

    // 🔹 Manual Attendance Mark
    const markAttendance = async (status) => {
        if (!participant) return;

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
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Failed to mark attendance");
                return;
            }

            setMessage(`Marked ${status}`);
            setParticipant(null);
            setAlreadyMarked(false);
        } catch (err) {
            console.error(err);
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

            {/* QR Scanner */}
            <div id="qr-reader" className="border rounded mb-4" />

            {/* Participant Card */}
            {participant && (
                <div className="bg-white shadow rounded p-4">
                    <h3 className="font-semibold">{participant.name}</h3>
                    <p className="text-sm">{participant.email}</p>
                    <p className="text-sm">Event: {participant.event}</p>

                    {alreadyMarked ? (
                        <p className={`mt-3 font-semibold ${markedStatus === "PRESENT" ? 'text-green-500' : 'text-red-600'}`}>
                            Already marked: {markedStatus}
                        </p>
                    ) : (
                        <div className="flex gap-3 mt-4">
                            <button
                                disabled={loading}
                                onClick={() => markAttendance("PRESENT")}
                                className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-50"
                            >
                                Present
                            </button>

                            <button
                                disabled={loading}
                                onClick={() => markAttendance("ABSENT")}
                                className="flex-1 bg-red-600 text-white py-2 rounded disabled:opacity-50"
                            >
                                Absent
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Message */}
            {message && (
                <p className="mt-4 text-center font-semibold text-indigo-600">
                    {message}
                </p>
            )}
        </div>
    );
};

export default AdminQRScanner;
