import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { contactInfo } from "../assets/assets";

const Contact = () => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const sendEmail = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/contact`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.success("Message sent successfully");
            setForm({ name: "", email: "", message: "" });

        } catch (err) {
            toast.error("Failed to send message");
        }
    };


    return (
        <>
            <div className="pt-36 pb-20 px-4 max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-primary mb-4">
                        Contact Us
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Have questions regarding registration, events, or payments?
                        Reach out to the ILAVENIL’26 organizing team — we’re happy to help!
                    </p>
                </div>


                {/* CONTACT INFO CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    <InfoCard
                        icon={<Mail />}
                        title="Email"
                        value="help.ilavenil26@gmail.com"
                    />
                    <InfoCard
                        icon={<Phone />}
                        title="Phone"
                        value="919043100583"
                    />
                    <InfoCard
                        icon={<Clock />}
                        title="Support Time"
                        value="9:00 AM – 6:00 PM"
                    />
                    <InfoCard
                        icon={<MapPin />}
                        title="Venue"
                        value="GTN Arts College, Dindigul"
                    />
                </div>


                {/* COORDINATORS */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        Event Coordinators
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="bg-white rounded-xl shadow p-5 text-center">
                                <Users className="mx-auto text-primary mb-3" />
                                <h4 className="font-semibold mb-1">{info.title}</h4>
                                <p className="text-sm text-gray-600 mb-1">{info.name}</p>
                                <a href={`tel:${info.phone}`} className="text-sm text-gray-600">
                                    +{info.phone.slice(0, 2)} {info.phone.slice(2, 7)} {info.phone.slice(7, 12)}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>


                {/* CONTACT FORM */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* MAP */}
                    <div className="w-full h-87.5 rounded-xl overflow-hidden shadow">
                        <iframe
                            title="GTN Arts College Location"
                            src="https://www.google.com/maps?q=GTN%20Arts%20College%20Dindigul&output=embed"
                            className="w-full h-full border-0"
                            loading="lazy"
                        />
                    </div>

                    {/* Message Form */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6">
                            Send Us a Message
                        </h2>

                        <form className="space-y-4" onSubmit={sendEmail}>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full border rounded-lg px-4 py-3"
                            />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                className="w-full border rounded-lg px-4 py-3"
                            />
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Your Message"
                                className="w-full border rounded-lg px-4 py-3"
                            />

                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90"
                            >
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </>
    );
};

/* ---------------- COMPONENTS ---------------- */

const InfoCard = ({ icon, title, value }) => (
    <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="flex justify-center mb-3 text-primary">
            {icon}
        </div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <a
            href={
                title === "Email"
                    ? `mailto:${value}`
                    : title === "Phone"
                        ? `tel:${value}`
                        : ``
            }
            className="text-sm text-gray-600">
            {title === "Phone" ? `+${value.slice(0, 2)} ${value.slice(2, 7)} ${value.slice(7, 12)}` : `${value}`}
        </a>
    </div >
);


const ActionButton = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition"
    >
        {label}
    </button>
);

export default Contact;
