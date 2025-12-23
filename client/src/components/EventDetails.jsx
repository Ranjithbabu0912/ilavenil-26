import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Clock,
    MapPin,
    Users,
    ArrowLeft,
    User2,
} from "lucide-react";

import { eventDetails } from "../assets/assets";
import Navbar from "./Navbar";

const EventDetails = () => {
    const { id } = useParams();          // id from URL
    const navigate = useNavigate();

    // 🔑 Find the selected event
    const event = eventDetails.find(
        (e) => String(e.id) === String(id)
    );

    // ❗ Safety check
    if (!event) {
        return (
            <div className="h-screen flex items-center justify-center text-white">
                Event not found
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* HERO */}
            <div
                className="relative mt-20 h-[60vh] flex items-center justify-center"
                style={{
                    backgroundImage: `url(${event.banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/70" />

                <div className="relative text-center px-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-4 -top-10 flex items-center gap-2 text-gray-300 hover:text-white"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    <h1 className="text-4xl md:text-6xl font-bold">
                        {event.name}
                    </h1>

                    <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
                        {event.desc}
                    </p>

                    <button className="mt-6 px-8 py-3 bg-indigo-600 rounded-full hover:bg-indigo-500 transition cursor-pointer">
                        Register Now
                    </button>
                </div>
            </div>

            {/* INFO */}
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 py-10 px-6 border-b border-black/30">
                <Info icon={<CalendarDays />} label="Date" value={"23 JAN 2026"} />
                <Info icon={<Clock />} label="Time" value={event.time} />
                <Info icon={<MapPin />} label="Venue" value={event.location} />
                <Info icon={<Users />} label="Team Size" value={event.noOfPart} />
            </div>

            {/* CONTENT */}
            <div className="max-w-5xl mx-auto px-6 py-14 space-y-12">

                <section>
                    <h2 className="text-2xl font-semibold mb-3">
                        Rules & Guidelines
                    </h2>
                    <ul className="list-disc pl-6 text-gray-500 space-y-2">
                        {event.rules.map((rule, i) => (
                            <li key={i}>{rule}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">
                        Judging Criteria
                    </h2>
                    <ul className="list-disc pl-6 text-gray-500 space-y-2">
                        {event.judging.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </section>

                
                {/* COORDINATORS */}
                <section className="">
                    <h2 className="text-2xl font-semibold mb-6">
                        Event Coordinators
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {event.coOrdinators.map((person, i) => (
                            <div
                                key={i}
                                className="bg-black/5 border border-black/10 rounded-xl p-5 flex items-center gap-6"
                            >
                                <div className="h-8 w-8 flex items-center justify-center text-white rounded-full bg-primary">
                                    <User2 />
                                </div>

                                <div className="flex flex-col">
                                    <h3 className="text-lg font-semibold">
                                        {person.name}
                                    </h3>

                                    <p className="text-sm text-indigo-400">
                                        {person.role}
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        {person.contact}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>
                </section>
            </div>




        </div>


    );
};

const Info = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="text-indigo-400">{icon}</div>
        <div>
            <p className="text-xs text-gray-400 uppercase">{label}</p>
            <p>{value}</p>
        </div>
    </div>
);

export default EventDetails;
