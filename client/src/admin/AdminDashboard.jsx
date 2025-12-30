import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { getPayments, approvePayment, rejectPayment } from "../services/adminApi";
import { toast } from "react-toastify";

const TABS = ["PENDING", "APPROVED", "REJECTED"];

const AdminDashboard = () => {
    const { isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();

    const [activeTab, setActiveTab] = useState("PENDING");
    const [payments, setPayments] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    const loadPayments = async () => {
        try {
            const token = await getToken({ template: "admin-template" });

            const data = await getPayments(token, page, search, activeTab);
            setPayments(data.payments);
            setTotalPages(data.totalPages);
        } catch {
            toast.error("Failed to load payments");
        }
    };

    useEffect(() => {
        if (isLoaded && isSignedIn) loadPayments();
    }, [activeTab, page, search, isLoaded, isSignedIn]);

    const handleApprove = async (id) => {
        setLoadingId(id);
        try {
            const token = await getToken({ template: "admin-template" });

            await approvePayment(id, token);
            toast.success("Payment approved");
            loadPayments();
        } catch {
            toast.error("Approve failed");
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Reject this payment?")) return;

        setLoadingId(id);
        try {
            const token = await getToken({ template: "admin-template" });

            await rejectPayment(id, token);
            toast.success("Payment rejected");
            loadPayments();
        } catch {
            toast.error("Reject failed");
        } finally {
            setLoadingId(null);
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                Loading admin dashboard…
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto md:px-4 md:py-10 md:mt-24">
            <h1 className="md:text-3xl text-2xl font-bold mb-6">Payment Management</h1>

            {/* 🔹 Tabs */}
            <div className="flex gap-4 border-b mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setPage(1);
                        }}
                        className={`pb-3 px-2 text-sm font-semibold border-b-2 transition ${activeTab === tab
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 🔹 Search */}
            <input
                type="text"
                placeholder="Search name / email / UTR"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                className="w-full md:w-96 mb-6 border rounded-lg px-4 py-2"
            />

            {/* 🔹 Cards */}
            {payments.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                    No {activeTab.toLowerCase()} payments
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {payments.map((reg) => (
                        <div key={reg._id} className="bg-white p-5 rounded-xl shadow border">
                            <div className="flex justify-between mb-2">
                                <h2 className="font-semibold">{reg.name}</h2>
                                <span className="text-xs px-2 py-1 rounded-full bg-amber-100">
                                    {reg.payment.status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600">{reg.email}</p>
                            <p className="text-sm mt-1">
                                <b>Event:</b> {reg.events?.primary}
                            </p>
                            <p className="text-sm mt-1">
                                <b>UTR:</b>{" "}
                                <span className="font-mono">{reg.payment?.utr}</span>
                            </p>

                            {reg.payment?.screenshot && (
                                <a
                                    href={`${reg.payment.screenshot}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-600 text-sm mt-2 inline-block"
                                >
                                    View Screenshot →
                                </a>
                            )}

                            {/* Actions only for PENDING */}
                            {activeTab === "PENDING" && (
                                <div className="flex gap-3 mt-4">
                                    <button
                                        disabled={loadingId === reg._id}
                                        onClick={() => handleApprove(reg._id)}
                                        className="flex-1 bg-green-600 cursor-pointer text-white py-2 rounded-lg text-sm"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        disabled={loadingId === reg._id}
                                        onClick={() => handleReject(reg._id)}
                                        className="flex-1 bg-red-600 cursor-pointer text-white py-2 rounded-lg text-sm"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* 🔹 Pagination
            <div className="flex justify-center items-center gap-4 mt-10">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 border rounded disabled:opacity-40"
                >
                    Prev
                </button>

                <span className="text-sm">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 border rounded disabled:opacity-40"
                >
                    Next
                </button>
            </div> */}
        </div>
    );
};

export default AdminDashboard;
