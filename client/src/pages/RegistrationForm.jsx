import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";


const eventsList = [
    { name: "CorpIQ", type: "2" },
    { name: "Market Mania", type: "2" },
    { name: "Zero Bug", type: "1" },
    { name: "Webify", type: "2" },
    { name: "IPL Auction", type: "2" },
    { name: "Mind Maze", type: "1" },
    { name: "Up2date", type: "1" },
    { name: "Yourspark", type: "max 5" },
]

const RegistrationForm = () => {

    const [loading, setLoading] = useState(false);

    const { user, isLoaded, isSignedIn } = useUser();

    const loggedInEmail = user?.primaryEmailAddress?.emailAddress;

    const navigate = useNavigate();

    const [selectedEvents, setSelectedEvents] = useState([])

    const handleEventChange = (eventName) => {
        if (selectedEvents.includes(eventName)) {
            // remove event
            setSelectedEvents(selectedEvents.filter(e => e !== eventName))
        } else {
            // add event only if less than 2
            if (selectedEvents.length < 2) {
                setSelectedEvents([...selectedEvents, eventName])
            } else {
                alert("You can select only 2 events")
            }
        }
    }

    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        collegeName: "",
        discipline: "",
        year: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoaded) return;

        if (!loggedInEmail) {
            toast.error("Login required");
            return;
        }

        if (selectedEvents.length < 1) {
            toast.error("Select at least one event");
            return;
        }

        const payload = {
            ...formData,
            email: loggedInEmail, // ✅ FROM LOGIN
            contact: Number(formData.contact),
            events: {
                primary: selectedEvents[0],
                secondary: selectedEvents[1] || null,
            },
        };

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/api/events/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                const registrationId = data.registrationId;

                localStorage.setItem("registeredEmail", loggedInEmail);
                navigate(`/success?page=register&rid=${registrationId}`);
                // navigate('/success')
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Server error. Try again later");
        } finally {
            setLoading(false);
        }
    };


    const userEmail = user?.primaryEmailAddress?.emailAddress || null;


    useEffect(() => {
        if (!isLoaded) return;

        // 🔐 Not logged in → Sign in
        if (!isSignedIn) {
            navigate("/sign-in");
            return;
        }
        const API_URL = import.meta.env.VITE_API_URL;

        // 🔁 Check if already registered
        const checkRegistration = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/api/events/check-status`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: userEmail }),
                    })
                    .then(res => res.json())
                    .then(console.log);
                const data = await res.json();

                if (data.success) {
                    // Already registered
                    toast.info("You are already registered");

                    // Redirect based on payment status
                    if (data.status === "NOT_PAID" || data.status === "REJECTED") {
                        navigate(`/payment/${data.registrationId}`);
                    } else {
                        navigate("/");
                    }
                }
            } catch {
                toast.error("Unable to verify registration");
            }
        };

        checkRegistration();
    }, [isLoaded, isSignedIn, userEmail, navigate]);





    return (
        <div className='my-30'>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 p-10 shadow-2xl rounded-2xl border-2 border-gray-200 max-w-lg mx-auto mt-10">

                <ArrowLeft className='cursor-pointer' onClick={() => navigate('/')}></ArrowLeft>
                <h1 className='text-2xl text-center font-bold underline'>Registration Form</h1>

                <label className='font-semibold text-lg'>Name</label>
                <input
                    type="text"
                    name="name"
                    className="border p-2 rounded"
                    required
                    onChange={handleChange}
                />

                <label className='font-semibold text-lg'>Contact</label>
                <input
                    type="tel"
                    name="contact"
                    className="border p-2 rounded"
                    required
                    onChange={handleChange}
                />


                <label className='font-semibold text-lg'>Email</label>
                <input
                    type="email"
                    name="email"
                    value={loggedInEmail || ""}
                    className="border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                    disabled
                    onChange={handleChange}
                />


                <label className='font-semibold text-lg'>College Name</label>
                <input
                    type="text"
                    name="collegeName"
                    className="border p-2 rounded"
                    required
                    onChange={handleChange}
                />


                <label className='font-semibold text-lg'>Discipline</label>
                <input
                    type="text"
                    name="discipline"
                    className="border p-2 rounded"
                    required
                    onChange={handleChange}
                />


                {/* Year of Study */}
                <div>
                    <label className="font-semibold text-lg">Year of Study</label>
                    <div className="flex gap-6 mt-1">
                        {["I", "II", "III", "IV"].map(y => (
                            <label key={y} className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="year"
                                    value={y}
                                    onChange={handleChange}
                                /> {y}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Events */}
                <div>
                    <label className="font-semibold text-lg">Participating Events <small className='text-xs font-normal text-gray-500 ml-1'>(No.of Participants)</small></label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {eventsList.map((event) => {
                            const isChecked = selectedEvents.includes(event.name)
                            const isDisabled =
                                selectedEvents.length === 2 && !isChecked

                            return (
                                <label
                                    key={event.name}
                                    className={`flex items-center gap-2 ${isDisabled ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={isDisabled}
                                        onChange={() => handleEventChange(event.name)}
                                    />
                                    <span>
                                        {event.name}
                                        <span className="text-xs text-gray-500 ml-1">
                                            ({event.type})
                                        </span>
                                    </span>
                                </label>
                            )
                        })}
                    </div>
                </div>


                <p className='text-xs text-gray-500 py-3'>
                    * Before submit, please re-check details
                </p>

                <div className='grid grid-cols-2 gap-6'>
                    <button
                        type="reset"
                        className="border-2 border-red-600 hover:bg-red-600 hover:text-white py-2 rounded"
                        onClick={() => setSelectedEvents([])}
                    >
                        Clear
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-800"
                            } text-white py-2 rounded`}
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default RegistrationForm
