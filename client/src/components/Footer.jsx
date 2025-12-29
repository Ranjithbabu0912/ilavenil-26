import { GithubIcon, Globe, Instagram, LucideLinkedin } from 'lucide-react'
import React from 'react'

const Footer = () => {

    const links = [
        { name: "About", link: '/about' },
        { name: "Events", link: '/events' },
        { name: "Register", link: '/register' },
        { name: "Contact", link: '/contact' },
    ]




    return (
        <div className='flex items-center justify-center bg-primary/25 mt-20 py-30'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-[80%] gap-20 items-center'>
                <div className='flex flex-col gap-3'>
                    <h1 className='logo-text text-5xl text-primary'>ILAVENIL'26</h1>
                    <p className='text-gray-500 text-xs'>Step into an exciting MBA & MCA intercollegiate meet packed with management battles, tech challenges, creative events, and innovation showcases.</p>
                    <p>Follow us</p>
                    <div>
                        <a href="" className='flex items-center gap-3'>
                            <p className='bg-primary h-10 w-10 rounded-full text-white flex items-center justify-center'><Instagram className='' /></p>
                            <p className='text-lg hover:text-primary'>@ilavenil.26</p>
                        </a>
                    </div>
                </div>
                <div className='flex flex-col lg:ml-20 gap-3 list-none'>
                    <h2 className='text-2xl font-bold mb-3 text-primary'>Quick Links</h2>
                    {links.map((links, index) => (
                        <div key={index} className=''>
                            <li className='hover:text-primary'><a href={links.link}>{links.name}</a></li>
                        </div>
                    ))}
                </div>

                <div className='flerx flex-col gap-3  list-none '>
                    <h2 className='text-2xl font-bold mb-3 text-primary'>Contact Info</h2>
                    <div className='flex flex-col gap-3'>
                        <li><a href="mailto:ilavenil26@gmail.com">ilavenil26@gmail.com</a></li>
                        <li><a href="tel:+919043100583">+91 90431 00583</a></li>
                        <li>G.T.N. Arts college, Old Karur Road, Dindigul, Tamil Nadu, India.</li>
                    </div>
                </div>

                <div className='flex flex-col gap-3 lg:ml-10'>
                    <div className='flex items-center gap-3'>
                        <a href="https://www.linkedin.com/in/ranjithbabu0912" target='_blank'>
                            <p className='bg-primary h-10 w-10 rounded-full text-white flex items-center justify-center'><LucideLinkedin className='' /></p>
                        </a>
                        <a href="https://ranjithbabu0912.github.io/portfolio" target='_blank'>
                            <p className='bg-primary h-10 w-10 rounded-full text-white flex items-center justify-center'><Globe className='' /></p>
                        </a>
                        <a href="https://github.com/Ranjithbabu0912" target='_blank'>
                            <p className='bg-primary h-10 w-10 rounded-full text-white flex items-center justify-center'><GithubIcon className='' /></p>
                        </a>
                    </div>
                    <p className='text-gray-600 text-sm'>© 2026 Intercollegiate meet. All rights reserved. Design and Developed by <span className='text-primary text-lg'>Ranjith Babu S</span></p>
                </div>
            </div>
        </div>
    )
}

export default Footer