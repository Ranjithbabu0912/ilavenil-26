import React from "react";
import Navbar from "../components/Navbar";
import { ChevronRight } from "lucide-react";

const Section = ({ title, children, image, reverse }) => {


    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-2 text-justify gap-10 items-center mb-20 ${reverse ? "md:flex-row-reverse" : ""
                }`}
        >
            {/* TEXT */}
            <div className={`${reverse ? "md:order-2" : ""}`}>
                <h2 className="text-3xl font-bold pl-3 mb-4">{title}</h2>
                <div className="space-y-3 text-gray-700 p-3 leading-relaxed">
                    {children}
                </div>
            </div>

            {/* IMAGE */}
            <div className={`${reverse ? "md:order-1" : ""} flex justify-center`}>
                <img
                    src={image}
                    alt={title}
                    className={
                        title === 'Department of MBA' || title === 'Department of MCA'
                            ? 'rounded-full w-60 md:w-100 max-w-full shadow-2xl'
                            : 'w-60 md:w-100 max-w-full rounded-3xl drop-shadow-xl drop-shadow-black/60'
                    }
                />
            </div>
        </div>
    );
};

const About = () => {

    return (
        <>
            <div className="max-w-6xl mx-auto px-4 pt-36 pb-20 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-center text-primary mb-20">
                    About
                </h1>

                {/* EVENT */}
                <Section
                    title="ILAVENIL’26"
                    image="/email-logo.png"
                >
                    <p>
                        <b>ILAVENIL’26</b> is an intercollegiate cultural and academic fest
                        that celebrates youth, creativity, leadership, and innovation.
                        Designed as a vibrant platform for students to showcase their
                        talents, the event brings together participants from various
                        institutions to compete, collaborate, and connect.
                    </p>

                    <p>
                        The name <b>Ilavenil</b> symbolizes freshness, growth, and youthful
                        energy. From technical competitions and management challenges to
                        cultural performances and creative showcases, <b>ILAVENIL’26</b>{" "}
                        encourages confidence, teamwork, and excellence.
                    </p>

                    <p>
                        More than just a competition, <b>ILAVENIL’26</b> is a celebration of
                        ideas, skills, and aspirations—where students transform passion into
                        performance.
                    </p>
                </Section>

                {/* MBA */}
                <Section
                    title="Department of MBA"
                    image="/MBA-logo.png"
                    reverse
                >
                    <p>
                        The Department of <b>Master of Business Administration (MBA)</b> is
                        committed to nurturing future leaders, entrepreneurs, and
                        decision-makers through a balanced blend of theory and practical
                        exposure.
                    </p>

                    <p>
                        With a strong focus on{" "}
                        <b>
                            leadership skills, strategic thinking, communication, and ethical
                            management practices
                        </b>
                        , the department encourages participation in seminars, workshops,
                        industrial visits, and intercollegiate events like ILAVENIL’26.
                    </p>

                    <p>
                        Through continuous learning and innovation, the MBA department
                        strives to develop professionals who are confident, competent, and
                        socially responsible.
                    </p>

                    <a href="https://mba-8ksn.onrender.com" target="_blank" className="flex items-center gap-2 px-3 py-2 bg-primary rounded-xl text-white w-fit hover:scale-110 active:scale-90 transition text-xs">
                        More Details <ChevronRight />
                    </a>
                </Section>

                {/* MCA */}
                <Section
                    title="Department of MCA"
                    image="/MCA-logo.png"
                >
                    <p>
                        The Department of <b>Master of Computer Applications (MCA)</b> focuses
                        on building strong foundations in computer science, software
                        development, and emerging technologies.
                    </p>

                    <p>
                        The department promotes hands-on learning through{" "}
                        <b>
                            projects, coding challenges, technical workshops, and
                            collaborative events
                        </b>
                        , encouraging innovation and problem-solving.
                    </p>

                    <p>
                        By fostering a culture of curiosity and continuous improvement, the
                        MCA department prepares students to become skilled professionals and
                        innovators in the field of technology.
                    </p>

                    <a href="https://www.gtnartscollege.ac.in/sf-mca.php" target="_blank" className="flex items-center gap-2 px-3 py-2 bg-primary rounded-xl text-white w-fit hover:scale-110 active:scale-90 transition text-xs">
                        More Details <ChevronRight />
                    </a>
                </Section>

                {/* COLLEGE */}
                <Section
                    title="About the College"
                    image="/GTN-logo.png"
                    reverse
                >
                    <p>
                        <b>G.T.N. Arts College (Autonomous), Dindigul</b> is a prestigious
                        institution known for its commitment to academic excellence,
                        discipline, and holistic development.
                    </p>

                    <p>
                        With experienced faculty, modern infrastructure, and a
                        student-centric approach, the institution empowers learners to
                        achieve their personal and professional goals.
                    </p>

                    <p>
                        Through quality education and value-based learning, the college
                        continues to shape responsible citizens and capable professionals.
                    </p>

                    <a href="https://www.gtnartscollege.ac.in" target="_blank" className="flex items-center gap-2 px-3 py-2 bg-primary rounded-xl text-white w-fit hover:scale-110 active:scale-90 transition text-xs">
                        More Details <ChevronRight />
                    </a>
                </Section>

            </div>
        </>
    );
};

export default About;
