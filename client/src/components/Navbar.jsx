import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const Navbar = ({ onOpenStatus }) => {
    const navigate = useNavigate();
    const { openSignIn } = useClerk();
    const { user, isLoaded, isSignedIn } = useUser();

    const [registered, setRegistered] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [registrationId, setRegistrationId] = useState(null);

    const userEmail = user?.primaryEmailAddress?.emailAddress || null;

    // 🔍 Check registration + payment status
    useEffect(() => {
        if (!isLoaded || !userEmail) return;

        const fetchStatus = async () => {
            try {
                const res = await fetch(
                    "http://localhost:5000/api/events/check-status",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: userEmail }),
                    }
                );

                const data = await res.json();

                if (data.success) {
                    setRegistered(true);
                    setPaymentStatus(data.status);
                    setRegistrationId(data.registrationId);
                } else {
                    setRegistered(false);
                }
            } catch {
                toast.error("Unable to fetch payment status");
            }
        };

        fetchStatus();
    }, [isLoaded, userEmail]);

    /* ================== BUTTON HANDLERS ================== */

    const handleRegister = () => navigate("/RegistrationForm");

    const handlePayment = () => {
        if (!registrationId) {
            toast.error("Registration not found");
            return;
        }
        navigate(`/payment/${registrationId}`);
    };

    /* ================== RENDER ================== */

    return (
        <div className="fixed top-0 z-999 w-full backdrop-blur-3xl flex justify-between items-center py-8 px-4 sm:px-20 xl:px-32">

            <h1
                className="text-sm md:text-xl lg:text-2xl xl:text-3xl cursor-pointer logo-text text-gray-800"
                onClick={() => navigate("/")}
            >
                ILAVENIL'26
            </h1>

            <nav className="hidden md:block">
                <ul className="flex gap-10">
                    <li onClick={() => navigate("/about")} className="cursor-pointer">About</li>
                    <li onClick={() => navigate("/events")} className="cursor-pointer">Events</li>
                    <li onClick={() => navigate("/contact")} className="cursor-pointer">Contact</li>
                </ul>
            </nav>

            <div className="flex gap-3">

                {/* 🔐 Login */}
                {!isSignedIn && (
                    <button
                        onClick={openSignIn}
                        className="md:px-5 md:py-3 px-3 py-2 rounded-lg bg-primary text-white flex items-center gap-2 cursor-pointer"
                    >
                        Sign In <ArrowRight className="h-4" />
                    </button>
                )}

                {/* 📝 Not Registered */}
                {isSignedIn && !registered && (
                    <button
                        onClick={handleRegister}
                        className="md:px-5 md:py-3 px-3 py-2 rounded-lg bg-primary text-white flex items-center gap-2 cursor-pointer"
                    >
                        Register Now <ArrowRight className="h-4" />
                    </button>
                )}

                {/* 💳 Registered but NOT PAID */}
                {isSignedIn &&
                    registered &&
                    (paymentStatus === "NOT_PAID" ||
                        paymentStatus === "REJECTED") && (
                        <button
                            onClick={handlePayment}
                            className="md:px-5 md:py-3 px-3 py-2 rounded-lg bg-primary text-white flex items-center gap-2 cursor-pointer"
                        >
                            Proceed to Payment <ArrowRight className="h-4" />
                        </button>
                    )}

                {/* ⏳ Payment submitted / approved */}
                {isSignedIn &&
                    registered &&
                    (paymentStatus === "PENDING" ||
                        paymentStatus === "APPROVED") && (
                        <button
                            onClick={onOpenStatus}
                            className="md:px-5 md:py-3 px-3 py-2 rounded-lg bg-primary text-white cursor-pointer"
                        >
                            Check Status
                        </button>
                    )}

                {isSignedIn && <UserButton />}

            </div>
        </div>
    );
};

export default Navbar;
