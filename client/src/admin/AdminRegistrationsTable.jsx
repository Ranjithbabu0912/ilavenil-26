import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const API_URL = import.meta.env.VITE_API_URL;

/* ---------------- STATUS BADGE ---------------- */
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

/* ---------------- MAIN COMPONENT ---------------- */
const AdminRegistrationsTable = () => {
    const { getToken } = useAuth();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState({
        event: "",
        teamName: "",
        college: "",
        city: "",
    });

    /* ---------------- LOAD DATA ---------------- */
    const loadData = async () => {
        try {
            setLoading(true);
            const token = await getToken({ template: "admin-template" });

            const res = await fetch(`${API_URL}/api/events/all-registration`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

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

    /* ---------------- UNIQUE FILTER VALUES ---------------- */
    const uniqueEvents = [
        ...new Set(
            data.flatMap((r) =>
                [r.events?.primary, r.events?.secondary].filter(Boolean)
            )
        ),
    ];

    const uniqueColleges = [
        ...new Set(data.map((r) => r.collegeName).filter(Boolean)),
    ];

    const uniqueCities = [
        ...new Set(data.map((r) => r.collegeCity).filter(Boolean)),
    ];

    /* ---------------- FILTERED DATA ---------------- */
    const filtered = data.filter((r) => {
        const searchText = search.toLowerCase();

        const matchesSearch = [
            r.name,
            r.email,
            r.payment?.utr,
            r.contact,
        ]
            .join(" ")
            .toLowerCase()
            .includes(searchText);

        const matchesEvent =
            !filters.event ||
            r.events?.primary === filters.event ||
            r.events?.secondary === filters.event;

        const matchesTeam =
            !filters.teamName ||
            r.teamName?.toLowerCase().includes(filters.teamName.toLowerCase());

        const matchesCollege =
            !filters.college || r.collegeName === filters.college;

        const matchesCity =
            !filters.city || r.collegeCity === filters.city;

        return (
            matchesSearch &&
            matchesEvent &&
            matchesTeam &&
            matchesCollege &&
            matchesCity
        );
    });

    /* ---------------- HELPERS ---------------- */
    const formatEvents = (events) => {
        if (!events) return "";
        return events.secondary
            ? `${events.primary}, ${events.secondary}`
            : events.primary || "";
    };

    /* ---------------- EXPORT EXCEL ---------------- */
    const exportExcel = () => {
        if (!filtered.length) {
            toast.error("No data to export");
            return;
        }

        const excelData = filtered.map((r) => ({
            Name: r.name,
            TeamName: r.teamName || "",
            Event: formatEvents(r.events),
            Email: r.email,
            Contact: r.contact || "",
            College: r.collegeName || "",
            Department: r.discipline || "",
            Year: r.year || "",
            City: r.collegeCity || "",
            PaymentStatus: r.payment?.status || "",
            UTR: r.payment?.utr || "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
        XLSX.writeFile(workbook, "registrations.xlsx");
    };

    /* ---------------- LOADING ---------------- */
    if (loading) {
        return (
            <div className="text-center py-20 text-gray-500">
                Loading registrations…
            </div>
        );
    }

    /* ---------------- UI ---------------- */
    return (
        <div className="p-4 md:mt-24 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">All Registrations</h1>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search name / email / UTR / contact"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-4 py-2 rounded w-full md:w-96 mb-4"
            />

            {/* FILTERS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <select
                    className="border px-3 py-2 rounded"
                    value={filters.event}
                    onChange={(e) =>
                        setFilters({ ...filters, event: e.target.value })
                    }
                >
                    <option value="">All Events</option>
                    {uniqueEvents.map((e) => (
                        <option key={e} value={e}>{e}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Team name"
                    className="border px-3 py-2 rounded"
                    value={filters.teamName}
                    onChange={(e) =>
                        setFilters({ ...filters, teamName: e.target.value })
                    }
                />

                <select
                    className="border px-3 py-2 rounded"
                    value={filters.college}
                    onChange={(e) =>
                        setFilters({ ...filters, college: e.target.value })
                    }
                >
                    <option value="">All Colleges</option>
                    {uniqueColleges.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <select
                    className="border px-3 py-2 rounded"
                    value={filters.city}
                    onChange={(e) =>
                        setFilters({ ...filters, city: e.target.value })
                    }
                >
                    <option value="">All Cities</option>
                    {uniqueCities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mb-4">
                <button
                    onClick={() =>
                        setFilters({ event: "", teamName: "", college: "", city: "" })
                    }
                    className="border px-4 py-2 rounded text-sm"
                >
                    Clear Filters
                </button>

                <button
                    onClick={exportExcel}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                    Export Excel
                </button>
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100 text-sm">
                        <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Team</th>
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
                                <td className="px-4 py-3">{r.teamName || "-"}</td>
                                <td className="px-4 py-3">{formatEvents(r.events)}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={r.payment?.status} />
                                </td>
                                <td className="px-4 py-3 font-mono">
                                    {r.payment?.utr || "-"}
                                </td>
                                <td className="px-4 py-3">{r.email}</td>
                                <td className="px-4 py-3 text-blue-600"> <a href={r.payment.screenshotUrl} target="_blank">View</a></td>
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

            {/* MOBILE CARDS */}
            <div className="md:hidden mt-4 space-y-4">
                {filtered.map((r) => (
                    <div key={r._id} className="bg-white p-4 rounded shadow border">
                        <div className="flex justify-between">
                            <h3 className="font-semibold">{r.name}</h3>
                            <StatusBadge status={r.payment?.status} />
                        </div>
                        <p className="text-sm">Team: {r.teamName || "Solo"}</p>
                        <p className="text-sm">Event: {formatEvents(r.events)}</p>
                        <p className="text-sm font-mono">UTR: {r.payment?.utr || "-"}</p>
                        <p className="text-sm font-mono">
                                {r.payment?.screenshotUrl ? (
                                    <a
                                        href={r.payment.screenshotUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        View Screenshot
                                    </a>
                                ) : (
                                    "-"
                                )}
                            </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminRegistrationsTable;
