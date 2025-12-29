const API = import.meta.env.VITE_API_URL;

export const getPendingPayments = async (token, page, search = "") => {
    const res = await fetch(
        `${API}/api/admin/payments/pending?page=${page}&limit=5&search=${encodeURIComponent(search)}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) throw new Error("Failed");
    return res.json();
};

export const getPayments = async (token, page, search, status) => {
    const res = await fetch(
        `${API}/api/admin/payments?status=${status}&page=${page}&limit=5&search=${search}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) throw new Error("Failed");
    return res.json();
};


export const approvePayment = async (id, token) => {
    const res = await fetch(`${API}/api/admin/payments/${id}/approve`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Approve failed");
};

export const rejectPayment = async (id, token) => {
    const res = await fetch(`${API}/api/admin/payments/${id}/reject`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Reject failed");
};