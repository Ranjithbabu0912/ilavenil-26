import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDailyDashboard = () => {
    const [stats, setStats] = useState(null);
    const [dailyData, setDailyData] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchDailyStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/registration-stats`);
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch stats");
        }
    };

    const fetchDailyStats = async () => {
        try {
            const res = await fetch(
                `${API_URL}/api/admin/daily-registration-stats`
            );
            const json = await res.json();

            if (json.success) {
                setDailyData(json.stats);
            }
        } catch (err) {
            console.error("Failed to fetch daily stats");
        }
    };

    if (!stats) {
        return (
            <p className="text-center mt-10 text-gray-500">
                Loading dashboard...
            </p>
        );
    }

    return (
        <div className="max-w-5xl mx-auto md:mt-24 p-6 space-y-10">

            {/* 🔢 COUNTERS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <StatBox label="Total Registered" value={stats.totalRegistrations} />
                <StatBox label="Limit" value={stats.limit} />
                <StatBox label="Remaining" value={stats.remaining} />
                <StatBox
                    label="Status"
                    value={stats.status}
                    color={stats.status === "OPEN" ? "text-green-600" : "text-red-600"}
                />
            </div>

            {/* 📊 DAILY BAR CHART */}
            <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-3 text-center">
                    Daily Registrations (01 Jan – 22 Jan 2026)
                </h3>

                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="registrations" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, color = "text-black" }) => (
    <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);

export default AdminDailyDashboard;
