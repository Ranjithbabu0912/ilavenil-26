const API = import.meta.env.VITE_API_URL;

export const submitPayment = (id, formData) =>
    fetch(`${API}/api/payments/manual/${id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
    });
