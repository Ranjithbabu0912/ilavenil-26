import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";

const eventsList = [
    { name: "CorpIQ", type: "2" },
    { name: "Market Mania", type: "5" },
    { name: "Zero Bug", type: "1" },
    { name: "Webify", type: "2" },
    { name: "IPL Auction", type: "2" },
    { name: "Mind Maze", type: "1" },
    { name: "Up2date", type: "1" },
    { name: "Yourspark", type: "max 5" },
];

const groupEvents = ["CorpIQ", "Market Mania", "Webify", "IPL Auction", "Yourspark"];

const genderOptions = ["Male", "Female", "Other"];

const departmentOptions = [
    "BA (General)",
    "BA English",
    "BA Economics",
    "BA History",
    "BA Political Science",
    "BA Psychology",
    "BFA (Fine Arts)",
    "Journalism & Mass Communication",
    "BSc (General)",
    "BSc Mathematics",
    "BSc Physics",
    "BSc Chemistry",
    "BSc Computer Science",
    "BSc Information Technology",
    "BSc Biotechnology",
    "BSc Data Science / AI",
    "BCom (General)",
    "BCom Accounting & Finance",
    "BCom Computer Applications",
    "BBA",
    "BMS / BBM",
    "Hotel Management",
    "BE / BTech (All branches)",
    "BTech Computer Science / IT",
    "BTech AI & Data Science",
    "BTech Mechanical",
    "BTech Civil",
    "BTech ECE / EEE",
    "MBBS",
    "BDS",
    "BSc Nursing",
    "BPharm",
    "Physiotherapy (BPT)",
    "Allied Health Sciences",
    "BCA",
    "BSc Computer Applications",
    "BA LLB",
    "BBA LLB",
    "LLB",
    "BEd",
    "Agriculture (BSc)",
    "Design / Fashion",
    "Social Work (BSW)",
    "Other",
];


const cityOptions = [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
    "Other",
];


const AdminOnSpot = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(false);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("CASH");

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        contact: "",
        email: "",
        collegeName: "",
        discipline: "",
        disciplineOther: "",
        collegeCity: "",
        collegeCityOther: "",
        year: "",
        soloOrGroup: "",
        teamName: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // contact validation
        if (name === "contact" && !/^\d{0,10}$/.test(value)) return;

        setFormData({ ...formData, [name]: value });
    };

    const handleEventChange = (eventName) => {
        if (selectedEvents.includes(eventName)) {
            setSelectedEvents(selectedEvents.filter((e) => e !== eventName));
        } else {
            if (selectedEvents.length >= 2) {
                toast.error("You can select only 2 events");
                return;
            }
            setSelectedEvents([...selectedEvents, eventName]);
        }
    };

    const hasMandatoryGroupEvent = selectedEvents.some(
        (e) => groupEvents.includes(e) && e !== "Yourspark"
    );

    const isOnlyYourspark =
        selectedEvents.length === 1 && selectedEvents[0] === "Yourspark";

    const isTeamRequired =
        hasMandatoryGroupEvent ||
        (isOnlyYourspark && formData.soloOrGroup === "group");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedEvents.length) {
            toast.error("Select at least one event");
            return;
        }

        if (isTeamRequired && !formData.teamName.trim()) {
            toast.error("Team name is required");
            return;
        }

        const payload = {
            name: formData.name,
            gender: formData.gender,
            contact: Number(formData.contact),
            email: formData.email,
            collegeName: formData.collegeName,
            discipline:
                formData.discipline === "Other"
                    ? formData.disciplineOther
                    : formData.discipline,
            collegeCity:
                formData.collegeCity === "Other"
                    ? formData.collegeCityOther
                    : formData.collegeCity,
            year: formData.year,
            soloOrGroup: hasMandatoryGroupEvent ? "group" : formData.soloOrGroup,
            teamName: isTeamRequired ? formData.teamName : "Solo",
            events: {
                primary: selectedEvents[0],
                secondary: selectedEvents[1] || null,
            },
            mode: "ONSPOT",
            registeredBy: user?.fullName,
            payment: {
                method: paymentMethod,
                status: "APPROVED",
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
                toast.success("On-Spot Registration Successful");
                setFormData({
                    name: "",
                    gender: "",
                    contact: "",
                    email: "",
                    collegeName: "",
                    discipline: "",
                    disciplineOther: "",
                    collegeCity: "",
                    collegeCityOther: "",
                    year: "",
                    soloOrGroup: "",
                    teamName: "",
                });
                setSelectedEvents([]);
                setPaymentMethod("CASH");
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Server error. Try again later");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) navigate("/sign-in");
    }, [isLoaded, isSignedIn]);


    const isOtherInvalid =
        (formData.discipline === "Other" && !formData.disciplineOther.trim()) ||
        (formData.collegeCity === "Other" && !formData.collegeCityOther.trim());


    return (
        <div className="md:my-30 min-w-full ">
            <h1 className="text-4xl font-bold mb-10">On Spot Registration</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row md:min-w-xl gap-6"
            >

                <div className='flex flex-col gap-3 md:w-xl'>

                    {/* Name */}
                    <label className="font-semibold text-lg">Name</label>
                    <input type="text" name="name" required className="border p-2 rounded" onChange={handleChange} />

                    {/* Gender */}
                    <label className="font-semibold text-lg">Gender</label>
                    <select
                        name="gender"
                        required
                        className="border p-2 rounded"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select Gender</option>
                        {genderOptions.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>


                    {/* Contact */}
                    <label className="font-semibold text-lg">Contact</label>
                    <input type="tel" name="contact" required className="border p-2 rounded" onChange={handleChange} />

                    {/* Email */}
                    <label className="font-semibold text-lg">Email</label>
                    <input
                        type="email"
                        name='email'
                        required
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />


                    {/* Department */}
                    <label className="font-semibold text-lg">Department / Course</label>
                    <select
                        name="discipline"
                        required
                        className="border p-2 rounded"
                        value={formData.discipline}
                        onChange={handleChange}
                    >
                        <option value="">Select Department / Course</option>
                        {departmentOptions.map(dep => (
                            <option key={dep} value={dep}>{dep}</option>
                        ))}
                    </select>

                    {formData.discipline === "Other" && !formData.disciplineOther.trim() && (
                        <p className="text-xs text-red-500">
                            Please specify your department / course
                        </p>
                    )}


                </div>

                <div className='flex flex-col md:-mt-24 gap-3 md:w-xl'>

                    {/* Auto show when Other */}
                    {formData.discipline === "Other" && (
                        <input
                            type="text"
                            name="disciplineOther"
                            placeholder="Enter Department / Course"
                            required
                            className="border p-2 rounded mt-2"
                            value={formData.disciplineOther}
                            onChange={handleChange}
                        />
                    )}



                    {/* College */}
                    <label className="font-semibold text-lg">College Name</label>
                    <input type="text" name="collegeName" required className="border p-2 rounded" onChange={handleChange} />



                    {/* City */}
                    <label className="font-semibold text-lg">College City / District</label>
                    <select
                        name="collegeCity"
                        required
                        className="border p-2 rounded"
                        value={formData.collegeCity}
                        onChange={handleChange}
                    >
                        <option value="">Select City / District</option>
                        {cityOptions.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    {formData.collegeCity === "Other" && !formData.collegeCityOther.trim() && (
                        <p className="text-xs text-red-500">
                            Please specify your city / district
                        </p>
                    )}

                    {/* Auto show when Other */}
                    {formData.collegeCity === "Other" && (
                        <input
                            type="text"
                            name="collegeCityOther"
                            placeholder="Enter City / District"
                            required
                            className="border p-2 rounded mt-2"
                            value={formData.collegeCityOther}
                            onChange={handleChange}
                        />
                    )}



                    {/* Year */}
                    <label className="font-semibold text-lg">Year of Study</label>
                    <div className="flex gap-6">
                        {["I", "II", "III", "IV"].map(y => (
                            <label key={y} className="flex items-center gap-1">
                                <input type="radio" name="year" value={y} required onChange={handleChange} />
                                {y}
                            </label>
                        ))}
                    </div>

                    {/* Events */}
                    <label className="font-semibold text-lg">
                        Participating Events <span className="text-xs text-gray-500">(Max 2)</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                        {eventsList.map(event => {
                            const isChecked = selectedEvents.includes(event.name);
                            const isDisabled = selectedEvents.length === 2 && !isChecked;

                            return (
                                <label key={event.name} className={`flex items-center gap-2 ${isDisabled && "opacity-50"}`}>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={isDisabled}
                                        onChange={() => handleEventChange(event.name)}
                                    />
                                    {event.name} <span className="text-xs text-gray-500">({event.type})</span>
                                </label>
                            );
                        })}
                    </div>

                    {/* Team Name */}
                    {/* Solo / Group choice ONLY for Yourspark */}
                    {isOnlyYourspark && (
                        <>
                            <label className="font-semibold text-lg">
                                Select Participation Type
                            </label>

                            <div className="flex gap-6">
                                <label>
                                    <input
                                        type="radio"
                                        name="soloOrGroup"
                                        value="solo"
                                        checked={formData.soloOrGroup === "solo"}
                                        onChange={handleChange}
                                        required
                                    />
                                    Solo
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="soloOrGroup"
                                        value="group"
                                        checked={formData.soloOrGroup === "group"}
                                        onChange={handleChange}
                                        required
                                    />
                                    Group
                                </label>
                            </div>
                        </>
                    )}

                    {/* Team Name – ONLY when required */}
                    {isTeamRequired && (
                        <>
                            <label className="font-semibold text-lg">
                                Team Name <span className="text-xs text-gray-500">(Group events only)</span>
                            </label>

                            <input
                                type="text"
                                name="teamName"
                                value={formData.teamName}
                                onChange={handleChange}
                                required
                                className="border p-2 rounded"
                            />

                            <p className="text-xs -mt-2 text-gray-500">
                                Kindly enter the same team name for all team members
                            </p>
                        </>
                    )}





                    <label className="font-semibold text-lg">Payment Method</label>
                    <div className="flex gap-6">
                        <label>
                            <input
                                type="radio"
                                value="CASH"
                                checked={paymentMethod === "CASH"}
                                onChange={() => setPaymentMethod("CASH")}
                            />
                            Cash
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="UPI"
                                checked={paymentMethod === "UPI"}
                                onChange={() => setPaymentMethod("UPI")}
                            />
                            UPI
                        </label>
                    </div>




                    <div className="grid grid-cols-2 gap-6 mt-4">
                        <button
                            type="reset"
                            className="border-2 border-red-600 hover:bg-red-600 hover:text-white py-2 rounded"
                            onClick={() => setSelectedEvents([])}
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            disabled={loading || isOtherInvalid}
                            className={`text-white py-2 rounded ${loading || isOtherInvalid
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-800"}
                            `}
                        >
                            {loading ? "Loading..." : "Register"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminOnSpot;
