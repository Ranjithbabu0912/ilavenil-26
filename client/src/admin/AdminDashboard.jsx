import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { getPayments, approvePayment, rejectPayment } from "../services/adminApi";
import { toast } from "react-toastify";

const TABS = ["PENDING", "APPROVED", "REJECTED"];

/* ================= SKELETON ================= */
const PaymentSkeleton = () => (
    <div className="animate-pulse bg-white p-5 rounded-xl shadow border space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="h-8 bg-gray-200 rounded mt-4"></div>
    </div>
);

/* ================= SEARCH HIGHLIGHT ================= */

const highlightText = (text = "", query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 px-1 rounded">
                {part}
            </mark>
        ) : (
            part
        )
    );
};

/* ================= REJECT MODAL ================= */
const RejectModal = ({ loading, onClose, onSubmit }) => {
    const [reason, setReason] = useState("");

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-2">Reject Payment</h2>

                <p className="text-sm text-gray-500 mb-3">
                    Please provide a clear reason for rejection.
                </p>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Eg: UTR not matching, screenshot unclear..."
                    rows={4}
                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500"
                />

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!reason.trim() || loading}
                        onClick={() => onSubmit(reason)}
                        className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white disabled:opacity-50"
                    >
                        Reject Payment
                    </button>
                </div>
            </div>
        </div>
    );
};


/* ================= MAIN DASHBOARD ================= */
const AdminDashboard = () => {
    const { isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();

    const [activeTab, setActiveTab] = useState("PENDING");
    const [payments, setPayments] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [isFetching, setIsFetching] = useState(false);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectingId, setRejectingId] = useState(null);

    /* ================= LOAD PAYMENTS ================= */
    const loadPayments = async () => {
        setIsFetching(true);
        try {
            const token = await getToken({ template: "admin-template" });
            const data = await getPayments(token, page, debouncedSearch, activeTab);
            setPayments(data.payments || []);
            setTotalPages(data.totalPages || 1);
        } catch {
            toast.error("Failed to load payments");
        } finally {
            setIsFetching(false);
        }
    };

    /* ================= SEARCH DEBOUNCE ================= */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [searchInput]);

    /* ================= FETCH ON CHANGE ================= */
    useEffect(() => {
        if (isLoaded && isSignedIn) loadPayments();
    }, [activeTab, page, debouncedSearch, isLoaded, isSignedIn]);

    /* ================= ACTIONS ================= */
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

    const handleReject = (id) => {
        setRejectingId(id);
        setShowRejectModal(true);
    };

    const submitReject = async (reason) => {
        setLoadingId(rejectingId);
        try {
            const token = await getToken({ template: "admin-template" });
            await rejectPayment(rejectingId, token, reason);
            toast.success("Payment rejected");
            setShowRejectModal(false);
            setRejectingId(null);
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
        <div className="max-w-7xl mx-auto px-4 md:mt-24">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
                Payment Management
            </h1>

            {/* TABS */}
            <div className="flex gap-4 border-b mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setPage(1);
                        }}
                        className={`pb-3 px-2 text-sm font-semibold border-b-2 transition 
                            ${activeTab === tab
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search name / email / UTR"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full md:w-96 mb-6 border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
            />

            {/* CONTENT */}
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

                                <span
                                    className={`text-xs px-2 py-1 rounded-full font-semibold
                    ${reg.payment.status === "APPROVED"
                                            ? "bg-green-100 text-green-700"
                                            : reg.payment.status === "REJECTED"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-amber-100 text-amber-700"
                                        }`}
                                >
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

                            <p className="text-sm mt-1">
                                {reg.payment?.screenshotUrl ? (
                                    <a
                                        href={reg.payment.screenshotUrl}
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

                            {activeTab === "REJECTED" && reg.payment?.rejectionReason && (
                                <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-xs font-semibold text-red-700">
                                        Rejection Reason
                                    </p>
                                    <p className="text-sm text-red-600 mt-1">
                                        {reg.payment.rejectionReason}
                                    </p>
                                </div>
                            )}

                            {activeTab === "PENDING" && (
                                <div className="flex gap-3 mt-4">
                                    <button
                                        disabled={loadingId || isFetching}
                                        onClick={() => handleApprove(reg._id)}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        disabled={loadingId || isFetching}
                                        onClick={() => handleReject(reg._id)}
                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* PAGINATION */}
            {totalPages <= "0" ? (
                <div className="flex items-center justify-center gap-4 mt-10">
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
            ) : ""}

            {showRejectModal && (
                <RejectModal
                    loading={loadingId === rejectingId}
                    onClose={() => {
                        setShowRejectModal(false);
                        setRejectingId(null);
                    }}
                    onSubmit={submitReject}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
