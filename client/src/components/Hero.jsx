import { useNavigate } from 'react-router-dom'
import '../index.css'
import { ArrowRight, ChevronsRight, ChevronRight, Clock, MapPin, NotepadText } from 'lucide-react'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Hero = () => {

    const navigate = useNavigate();
    const { openSignIn } = useClerk();
    const { user, isLoaded, isSignedIn } = useUser();

    const [registered, setRegistered] = useState(false);
    const userEmail = user?.primaryEmailAddress?.emailAddress || null;

    useEffect(() => {
        if (!isLoaded || !userEmail) return;

        const registeredEmail = localStorage.getItem("registeredEmail");
        setRegistered(registeredEmail === userEmail);
    }, [isLoaded, userEmail]);



    const registrationButton = () => {

        // 🔐 Not logged in
        if (!isSignedIn) {
            openSignIn();
            return;
        }

        // ✅ Already registered
        if (registered) {
            toast.info("You are already registered");
            return;
        }

        navigate("/RegistrationForm");
    };



    return (
        <div>
            <div className='px-4 sm:px-20 xl:px-32 relative inline-flex items-center w-full justify-around bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen'>

                {/* RULES $ GUIDELINES BTN */}
                <div className='hidden lg:block'>
                    <button
                        className='h-40 w-40 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer flex flex-col items-center justify-center gap-2 border border-gray-400 text-gray-800 hover:shadow-2xl'
                        onClick={() => navigate('/rules_and_guidelines')}
                    >
                        <NotepadText className='text-blue-700 h-20 w-20' />
                        Rules & Guidelines
                    </button>
                </div>

                {/* TEXT CONTENT */}
                <div className='flex flex-col mt-10'>


                    <div className='text-center mb-6 gap-3  text-gray-800'>
                        <h1 className='logo-text text-5xl md:text-6xl xl:text-8xl mx-auto leading-[1.2]'>ILAVENIL'26</h1>
                        <p className='text-sm md:text-lg'>A season of young talent</p>
                        <p className='text-xl md:text-3xl'>An Intercollegiate Meet</p>
                        <p className='text-sm md:text-lg'>Organized by</p>
                        <h1 className='text-xl md:text-3xl'>Department of <span className='font-semibold'>MBA & MCA</span></h1>
                        <h1 className='text-sm md:text-xl '>G.T.N. ARTS COLLEGE (Autonomous), Dindigul.</h1>


                        {/* REGISTRATION AND EXPLORE BTN */}
                        <div className='flex justify-center gap-4 mt-6'>

                            <button
                                className='px-5 py-3 text-xs md:text-sm rounded-lg flex items-center gap-2 bg-primary text-white'
                                onClick={registrationButton}
                            >
                                {registered ? "Already Registered" : "Register Now"}
                                {!registered && <ArrowRight />}
                            </button>


                            <button
                                className='px-5 py-3 text-xs md:text-sm rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer flex items-center gap-2 border border-primary text-primary hover:shadow-2xl'
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
                            className='px-5 py-3 rounded-lg text-xs md:text-sm hover:scale-102 active:scale-95 transition cursor-pointer flex items-center gap-2 border-2 border-blue-400 text-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-2xl'
                        >
                            Agenda <ChevronRight />
                        </button>

                        <button
                            className='px-5 py-3 rounded-lg text-xs md:text-sm flex items-center gap-2 border border-red-300 bg-red-200 text-red-700' >
                            <Clock />Deadline: Jan 20, 2026
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className='px-5 py-3 text-xs md:text-sm rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer flex items-center gap-2 border-2 border-green-400 text-green-500 hover:bg-green-500 hover:text-white hover:shadow-2xl'
                        >
                            Whatsapp <ChevronRight />
                        </button>

                    </div>
                </div>

                {/* LOCATION BTN */}
                <div className='hidden lg:block'>
                    <button
                        className='h-40 w-40 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer flex flex-col items-center justify-center gap-2 border border-blue-400 bg-blue-50 text-blue-600 hover:shadow-2xl'
                        onClick={() =>
                            window.open(
                                "https://maps.app.goo.gl/5ae8Sz3KtY123Gep8",
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        <MapPin className='h-20 w-20' />View Location
                    </button>
                </div>

            </div>


        </div>

    )
}
export default Hero