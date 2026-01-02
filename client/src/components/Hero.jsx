import { useNavigate } from 'react-router-dom'
import '../index.css'
import { ArrowRight, ChevronsRight, MessageCircle, MapPin, CalendarClock } from 'lucide-react'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Countdown from './Countdown/Countdown'

const Hero = () => {

    const navigate = useNavigate();
    const { openSignIn } = useClerk();
    const { user, isLoaded, isSignedIn } = useUser();

    const [registered, setRegistered] = useState(false);

    const userEmail = user?.primaryEmailAddress?.emailAddress || null;

    useEffect(() => {
        if (!isLoaded) return;

        // 🔴 User logged out → reset everything
        if (!isSignedIn || !userEmail) {
            setRegistered(false);
            localStorage.removeItem("registeredEmail");
            return;
        }

        const storedEmail = localStorage.getItem("registeredEmail");

        // 🟢 If same user, trust cache
        if (storedEmail === userEmail) {
            setRegistered(true);
            return;
        }

        // 🔥 Otherwise VERIFY WITH BACKEND
        const checkRegistration = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/events/check-status`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: userEmail }),
                    }
                );

                const data = await res.json();

                if (data?.success) {
                    localStorage.setItem("registeredEmail", userEmail);
                    setRegistered(true);
                } else {
                    localStorage.removeItem("registeredEmail");
                    setRegistered(false);
                }
            } catch {
                setRegistered(false);
            }
        };

        checkRegistration();
    }, [isLoaded, isSignedIn, userEmail]);



    const isAdmin = user?.publicMetadata?.role === "admin";



    const registrationButton = () => {

        // 🔐 Not logged in
        if (!isSignedIn) {
            openSignIn();
            return;
        }

        if (isAdmin) {
            navigate('/admin');
            return;
        }

        // ✅ Already registered
        if (registered) {
            toast.info("You are already registered");
            return;
        }

        navigate("/register");
    };



    const REGISTRATION_DEADLINE = new Date("2026-01-20T23:59:59");

    const calculateTimeLeft = () => {
        const now = new Date();
        const diff = REGISTRATION_DEADLINE - now;

        if (diff <= 0) {
            return null; // expired
        }

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());


    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);



    return (
        <div>
            <div className='px-4 sm:px-20 xl:px-32 relative inline-flex items-center justify-center w-full bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen'>


                {/* TEXT CONTENT */}
                <div className='flex flex-col mt-10'>

                    {/* ⏳ REGISTRATION COUNTDOWN */}
                    <Countdown timeLeft={timeLeft} />




                    <div className='text-center mb-6 gap-3  text-gray-800'>
                        <h1 className='logo-text text-5xl md:text-6xl xl:text-8xl mx-auto leading-[1.2]'>ILAVENIL'26</h1>
                        <p className='text-sm md:text-lg'>A season of young talent</p>
                        <p className='text-xl md:text-3xl'>An Intercollegiate Meet</p>
                        <p className='text-sm md:text-lg'>Organized by</p>
                        <h1 className='text-xl md:text-3xl'>Departments of <span className='font-semibold'>MBA & MCA</span></h1>
                        <h1 className='text-sm md:text-xl '>G.T.N. ARTS COLLEGE (Autonomous), Dindigul.</h1>


                        {/* REGISTRATION AND EXPLORE BTN */}
                        <div className='flex justify-center gap-4 mt-6'>

                            <button
                                onClick={registrationButton}
                                disabled={!timeLeft}
                                className={`px-5 py-3 text-xs md:text-sm rounded-lg flex items-center gap-2 transition ${!timeLeft
                                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                    : registered
                                        ? "bg-green-600 text-white cursor-not-allowed"
                                        : "bg-primary hover:bg-blue-800 text-white hover:scale-102 active:scale-95 hover:shadow-2xl"
                                    } `}
                            >
                                {!timeLeft
                                    ? "Registration Closed"
                                    : registered
                                        ? "Already Registered"
                                        : "Register Now"}

                                {timeLeft && !registered && <ArrowRight />}
                            </button>



                            <button
                                className='px-5 py-3 text-xs md:text-sm rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer flex items-center gap-2 border-2 border-primary text-primary hover:shadow-2xl hover:bg-primary hover:text-white'
                                onClick={() => navigate('/events')}
                            >
                                Explore Events <ChevronsRight />
                            </button>

                        </div>
                    </div>

                    {/* WHATSAPP GROUP, DEADLINE DATE AND AGENDA */}

                    <div className='flex flex-wrap justify-center gap-6'>

                        <button
                            onClick={() => navigate('/agenda')}
                            className='px-5 py-3 rounded-lg text-xs md:text-sm hover:scale-102 active:scale-95 transition cursor-pointer flex items-center gap-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-2xl'
                        >
                            <CalendarClock /> Agenda
                        </button>

                        <button
                            onClick={() => window.open(
                                "https://chat.whatsapp.com/IlF8utFK4b47BTVbj5bLVB",
                                "_blank",
                                "noopener,noreferrer"
                            )}
                            className='px-5 py-3 text-xs md:text-sm rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer flex items-center gap-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:shadow-2xl'
                        >
                             <MessageCircle /> Whatsapp
                        </button>



                        <button
                            className='px-5 py-3 rounded-lg text-xs md:text-sm hover:scale-102 active:scale-95 transition cursor-pointer flex items-center gap-2 border-2 border-amber-700 text-amber-700 hover:shadow-2xl hover:bg-amber-700 hover:text-white'
                            onClick={() =>
                                window.open(
                                    "https://maps.app.goo.gl/5ae8Sz3KtY123Gep8",
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                        >
                            <MapPin />View Location
                        </button>

                    </div>
                </div>

                {/* LOCATION BTN */}
                <div className='hidden lg:block'>

                </div>

            </div>


        </div>

    )
}
export default Hero