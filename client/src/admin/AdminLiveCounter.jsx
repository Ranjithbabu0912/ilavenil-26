import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const AdminLiveCounter = () => {
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);

    const fetchStats = async () => {
        const res = await fetch(`${API_URL}/api/admin/registration-stats`);
        const data = await res.json();

        setStats(data);

        // 📈 push data point for graph
        setHistory(prev => [
            ...prev.slice(-20), // keep last 20 points
            {
                time: new Date().toLocaleTimeString(),
                registrations: data.totalRegistrations,
            },
        ]);
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 5000); // every 5 sec
        return () => clearInterval(interval);
    }, []);

    if (!stats) return <p className="text-center mt-10">Loading dashboard...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-24 p-6 space-y-8">
            {/* 🔢 COUNTER */}
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

            {/* 📈 GRAPH */}
            <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-3 text-center">
                    📈 Live Registration Trend
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="registrations"
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
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

export default AdminLiveCounter;
