import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = ({ onOpenStatus }) => {

    const navigate = useNavigate();
    const { user } = useUser();
    const { openSignIn } = useClerk();

    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem("registeredEmail");
        if (email) {
            setRegistered(true);
        }
    }, []);

    return (
        <div className='fixed top-0 z-5 w-full backdrop-blur-2xl flex justify-between items-center py-8 px-4 sm:px-20 xl:px-32'>

            <h1 className='text-sm md:text-xl lg:text-2xl xl:text-3xl cursor-pointer logo-text text-gray-800' onClick={() => navigate('/')}>ILAVENIL'26</h1>

            <div className='hidden md:block'>
                <nav>
                    <ul className='flex gap-10'>
                        <li className='cursor-pointer ' onClick={() => navigate('/about')}>About</li>
                        <li className='cursor-pointer ' onClick={() => navigate('/events')}>Events</li>
                        <li className='cursor-pointer ' onClick={() => navigate('/contact')}>Contact</li>
                    </ul>
                </nav>
            </div>

            <div className='flex gap-3'>
                {
                    user ? <UserButton /> : (
                        <button
                            className='md:px-5 md:py-3 px-3 py-2 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer text-[10px] md:text-sm flex items-center md:gap-2 bg-primary text-white hover:shadow-2xl'
                            onClick={openSignIn}
                        >
                            Sign In <ArrowRight className='h-3 md:h-5' />
                        </button>
                    )
                }
                {
                    user && !registered ? (
                        <button
                            className='md:px-5 md:py-3 px-3 py-2 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer text-[10px] md:text-sm flex items-center md:gap-2 bg-primary text-white hover:shadow-2xl'
                            onClick={() => navigate('/RegistrationForm')}
                        >
                            Register Now <ArrowRight className='h-3 md:h-5' />
                        </button>

                    ) : ""
                }
                {user && registered ? (
                    <button
                        onClick={onOpenStatus}
                        className="md:px-5 md:py-3 px-3 py-2 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer text-[10px] md:text-sm flex items-center md:gap-2 bg-primary text-white hover:shadow-2xl"
                    >
                        Check Status
                    </button>
                ) : ""
                }
            </div>


        </div>
    )
}

export default Navbar
