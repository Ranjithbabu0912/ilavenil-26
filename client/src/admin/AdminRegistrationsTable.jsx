import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";



const API_URL = import.meta.env.VITE_API_URL;

const StatusBadge = ({ status }) => {
    const map = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-600"
                }`}
        >
            {status || "N/A"}
        </span>
    );
};

const AdminRegistrationsTable = () => {
    const { getToken } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            const token = await getToken({ template: "admin-template" });

            const res = await fetch(
                `${API_URL}/api/events/all-registration`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const json = await res.json();
            setData(json.registrations || []);
        } catch (err) {
            toast.error("Failed to load registrations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filtered = data.filter((r) =>
        [r.name, r.email, r.payment?.utr, r.contact]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const formatEvents = (events) => {
        if (!events) return "";

        if (events.secondary) {
            return `${events.primary}, ${events.secondary}`;
        }

        return events.primary || "";
    };

    const exportExcel = () => {
        if (!filtered.length) {
            toast.error("No data to export");
            return;
        }

        const excelData = filtered.map((r) => ({
            Name: r.name,
            Event: formatEvents(r.events),
            Email: r.email,
            Contact: r.contact || "",
            CollegeName: r.collegeName || "",
            Department: r.discipline || "",
            YearOfStudy: r.year || "",
            CollegeCity: r.collegeCity || "",
            PaymentStatus: r.payment?.status || "",
            UTR: r.payment?.utr || "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

        XLSX.writeFile(workbook, "registrations.xlsx");
    };





    if (loading) {
        return (
            <div className="text-center py-20 text-gray-500">
                Loading registrations…
            </div>
        );
    }


    return (
        <div className="p-4 md:mt-24 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">All Registrations</h1>

            {/* 🔍 Search */}
            <div className="sticky top-0 bg-white z-10 pb-3">
                <input
                    type="text"
                    placeholder="Search name / email / UTR / contact"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 rounded w-full md:w-96"
                />
            </div>

            <div className="flex gap-3 mb-4">
                <button
                    onClick={exportExcel}
                    className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded text-sm"
                >
                    Export Excel
                </button>
            </div>



            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block mt-4 overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100 text-sm">
                        <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Events</th>
                            <th className="px-4 py-3 text-left">Payment</th>
                            <th className="px-4 py-3 text-left">UTR</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Screenshot</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm">
                        {filtered.map((r) => (
                            <tr key={r._id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{r.name}</td>
                                <td className="px-4 py-3">
                                    {formatEvents(r.events)}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={r.payment?.status} />
                                </td>
                                <td className="px-4 py-3 font-mono">
                                    {r.payment?.utr || "-"}
                                </td>
                                <td className="px-4 py-3">{r.email}</td>
                                <td className="px-4 py-3">
                                    {r.payment?.screenshotUrl ? (
                                        <a
                                            href={r.payment.screenshotUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            View
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500">
                                    No registrations found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="md:hidden mt-4 space-y-4">
                {filtered.map((r) => (
                    <div
                        key={r._id}
                        className="bg-white rounded-xl shadow p-4 border space-y-2"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">{r.name}</h3>
                            <StatusBadge status={r.payment?.status} />
                        </div>

                        <p className="text-sm text-gray-600">{r.email}</p>

                        <p className="text-sm">
                            <b>Event:</b> {formatEvents(r.events)}
                        </p>

                        <p className="text-sm">
                            <b>UTR:</b>{" "}
                            <span className="font-mono">
                                {r.payment?.utr || "-"}
                            </span>
                        </p>

                        {r.payment?.screenshotUrl && (
                            <a
                                href={r.payment.screenshotUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block mt-2 text-blue-600 underline text-sm"
                            >
                                View Screenshot
                            </a>
                        )}
                    </div>
                ))}

                {filtered.length === 0 && (
                    <p className="text-center text-gray-500 py-10">
                        No registrations found
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdminRegistrationsTable;

