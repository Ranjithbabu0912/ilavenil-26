import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ShieldCheck, Menu, X } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const Navbar = ({ onOpenStatus }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { openSignIn } = useClerk();
    const { user, isLoaded, isSignedIn } = useUser();

    const [registered, setRegistered] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [registrationId, setRegistrationId] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const userEmail = user?.primaryEmailAddress?.emailAddress || null;
    const isAdmin = user?.publicMetadata?.role === "admin";

    /* 🔁 AUTO CLOSE MENU ON ROUTE CHANGE */
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    /* 🔍 CHECK REGISTRATION + PAYMENT STATUS */
    useEffect(() => {
        if (!isLoaded || !isSignedIn || !userEmail) return;

        const fetchStatus = async () => {

            const API_URL = import.meta.env.VITE_API_URL;

            try {
                const res = await fetch(
                    `${API_URL}/api/events/check-status`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email: userEmail }),
                    }
                );

                if (!res.ok) {
                    throw new Error("Request failed");
                }

                const data = await res.json();

                if (!data.success) {
                    setRegistered(false);
                    setPaymentStatus(null);
                    setRegistrationId(null);
                    return;
                }

                setRegistered(true);
                setPaymentStatus(data.status);
                setRegistrationId(data.registrationId);

            } catch (err) {
                console.error("Status fetch failed", err);
            }
        };


        fetchStatus();
    }, [isLoaded, isSignedIn, userEmail]);

    /* ================= HANDLERS ================= */

    const goTo = (path) => {
        setIsMenuOpen(false);
        navigate(path);
    };

    const handleRegister = () => {
        setIsMenuOpen(false);
        navigate("/register");
    };

    const handlePayment = () => {
        if (!registrationId) {
            toast.error("Registration not found");
            return;
        }
        setIsMenuOpen(false);
        navigate(`/payment/${registrationId}`);
    };

    /* ================= RENDER ================= */

    return (
        <header className="fixed top-0 z-100 w-full backdrop-blur-3xl shadow">
            <div className="flex justify-between items-center py-8 px-4 sm:px-20 xl:px-32">

                {/* LOGO */}
                <h1
                    className="text-lg md:text-2xl logo-text cursor-pointer"
                    onClick={() => goTo("/")}
                >
                    ILAVENIL'26
                </h1>

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex gap-10 items-center">

                    <span onClick={() => goTo("/")} className="cursor-pointer">Home</span>
                    <span onClick={() => goTo("/about")} className="cursor-pointer">About</span>
                    <span onClick={() => goTo("/events")} className="cursor-pointer">Events</span>
                    <span onClick={() => goTo("/contact")} className="cursor-pointer">Contact</span>

                    {isAdmin && (
                        <span
                            onClick={() => goTo("/admin")}
                            className="cursor-pointer text-red-600 font-semibold flex items-center gap-1"
                        >
                            <ShieldCheck className="h-4 w-4" />
                            Admin
                        </span>
                    )}
                </nav>

                {/* DESKTOP ACTIONS */}
                <div className="hidden md:flex gap-3 items-center">

                    {!isSignedIn && (
                        <button
                            onClick={openSignIn}
                            className="px-4 py-2 rounded-lg bg-primary text-white flex items-center gap-2"
                        >
                            Sign In <ArrowRight className="h-4" />
                        </button>
                    )}

                    {isSignedIn && !registered && !isAdmin && (
                        <button
                            onClick={handleRegister}
                            className="px-4 py-2 rounded-lg bg-primary text-white flex items-center gap-2"
                        >
                            Register Now <ArrowRight className="h-4" />
                        </button>
                    )}

                    {isSignedIn && registered && !isAdmin &&
                        (paymentStatus === "NOT_PAID" || paymentStatus === "REJECTED") && (
                            <button
                                onClick={handlePayment}
                                className="px-4 py-2 rounded-lg bg-primary text-white"
                            >
                                Proceed to Payment
                            </button>
                        )
                    }

                    {isSignedIn && registered && !isAdmin &&
                        (paymentStatus === "PENDING" || paymentStatus === "APPROVED") && (
                            <button
                                onClick={onOpenStatus}
                                className="px-4 py-2 rounded-lg bg-primary text-white"
                            >
                                Check Status
                            </button>
                        )
                    }

                    {isSignedIn && <UserButton />}
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* MOBILE SLIDE MENU */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
                ${isMenuOpen ? "max-h-175 opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="bg-white shadow-lg px-6 py-6 space-y-4">

                    <p onClick={() => goTo("/")} className="cursor-pointer">Home</p>
                    <p onClick={() => goTo("/about")} className="cursor-pointer">About</p>
                    <p onClick={() => goTo("/events")} className="cursor-pointer">Events</p>
                    <p onClick={() => goTo("/contact")} className="cursor-pointer">Contact</p>

                    {isAdmin && (
                        <p
                            onClick={() => goTo("/admin")}
                            className="cursor-pointer text-red-600 font-semibold flex items-center gap-2"
                        >
                            <ShieldCheck size={18} /> Admin
                        </p>
                    )}

                    <hr />

                    {!isSignedIn && (
                        <button
                            onClick={openSignIn}
                            className="w-full py-2 rounded-lg bg-primary text-white"
                        >
                            Sign In
                        </button>
                    )}

                    {isSignedIn && !registered && !isAdmin && (
                        <button
                            onClick={handleRegister}
                            className="w-full py-2 rounded-lg bg-primary text-white"
                        >
                            Register Now
                        </button>
                    )}

                    {isSignedIn && registered && !isAdmin &&
                        (paymentStatus === "NOT_PAID" || paymentStatus === "REJECTED") && (
                            <button
                                onClick={handlePayment}
                                className="w-full py-2 rounded-lg bg-primary text-white"
                            >
                                Proceed to Payment
                            </button>
                        )
                    }

                    {isSignedIn && registered && !isAdmin &&
                        (paymentStatus === "PENDING" || paymentStatus === "APPROVED") && (
                            <button
                                onClick={onOpenStatus}
                                className="w-full py-2 rounded-lg bg-primary text-white"
                            >
                                Check Status
                            </button>
                        )
                    }

                    {isSignedIn && <UserButton />}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
