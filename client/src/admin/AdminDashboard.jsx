import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { getPayments, approvePayment, rejectPayment } from "../services/adminApi";
import { toast } from "react-toastify";

const TABS = ["PENDING", "APPROVED", "REJECTED"];


const PaymentSkeleton = () => (
    <div className="animate-pulse bg-white p-5 rounded-xl shadow border space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="h-8 bg-gray-200 rounded mt-4"></div>
    </div>
);

const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 px-1 rounded">
                {part}
            </mark>
        ) : (
            part
        )
    );
};



const AdminDashboard = () => {
    const { isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();

    const [activeTab, setActiveTab] = useState("PENDING");
    const [payments, setPayments] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const [page, setPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [isFetching, setIsFetching] = useState(false);





    const loadPayments = async () => {
        setIsFetching(true);
        try {
            const token = await getToken({ template: "admin-template" });

            const data = await getPayments(token, page, debouncedSearch, activeTab);
            setPayments(data.payments);
            setTotalPages(data.totalPages);
        } catch {
            toast.error("Failed to load payments");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // reset page on new search
        }, 500); // ⏱ debounce delay

        return () => clearTimeout(timer);
    }, [searchInput]);


    useEffect(() => {
        if (isLoaded && isSignedIn) loadPayments();
    }, [activeTab, page, debouncedSearch, isLoaded, isSignedIn]);

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
            <div className="relative w-full md:w-96 mb-6">
                <input
                    type="text"
                    placeholder="Search name / email / UTR"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full border rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* 🔍 Search icon */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                </span>

                {/* ❌ Clear button */}
                {searchInput && (
                    <button
                        onClick={() => setSearchInput("")}
                        className="absolute right-3 top-5 -translate-y-1/2 cursor-pointer text-gray-400 text-lg"
                    >
                        x
                    </button>
                )}
            </div>


            {/* 🔹 Cards */}
            {isFetching ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <PaymentSkeleton key={i} />
                    ))}
                </div>
            ) : payments.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                    No {activeTab.toLowerCase()} payments
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {payments.map((reg) => (
                        <div key={reg._id} className="bg-white p-5 rounded-xl shadow border">
                            <div className="flex justify-between mb-2">
                                <h2 className="font-semibold">
                                    {highlightText(reg.name, debouncedSearch)}
                                </h2>
                                <span className="text-xs px-2 py-1 rounded-full bg-amber-100">
                                    {reg.payment.status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600">
                                {highlightText(reg.email, debouncedSearch)}
                            </p>
                            <p className="text-sm mt-1">
                                <b>Event:</b> {reg.events?.primary}
                            </p>
                            <p className="text-sm mt-1">
                                <b>UTR:</b>{" "}
                                <span className="font-mono">
                                    {highlightText(reg.payment?.utr || "", debouncedSearch)}
                                </span>
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
                                        disabled={loadingId === reg._id || isFetching}
                                        onClick={() => handleApprove(reg._id)}
                                        className="flex-1 bg-green-600 cursor-pointer text-white py-2 rounded-lg text-sm"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        disabled={loadingId === reg._id || isFetching}
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

            {/* 🔹 Pagination */}
            <div className={`justify-center items-center gap-4 mt-10 ${page === 1 ? 'hidden' : 'flex'}`} >
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
            </div>
        </div >
    );
};

export default AdminDashboard;
