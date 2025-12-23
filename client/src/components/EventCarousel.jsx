import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { eventDetails } from "../assets/assets";
import EventCard from "./EventCard";

const AUTO_SCROLL_TIME = 4000; // 4 seconds

const EventCarousel = () => {
    const [index, setIndex] = useState(0);
    const total = eventDetails.length;

    // 🔹 refs for touch & autoplay
    const startX = useRef(0);
    const autoRef = useRef(null);
    const isTouching = useRef(false);

    const prev = () => {
        setIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    };

    const next = () => {
        setIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    };

    // 🔁 AUTO SLIDE
    useEffect(() => {
        autoRef.current = setInterval(() => {
            if (!isTouching.current) {
                setIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
            }
        }, AUTO_SCROLL_TIME);

        return () => clearInterval(autoRef.current);
    }, [total]);

    // 👆 TOUCH HANDLERS
    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
        isTouching.current = true;
        clearInterval(autoRef.current);
    };

    const handleTouchEnd = (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX.current - endX;

        // swipe threshold
        if (diff > 50) {
            next();
        } else if (diff < -50) {
            prev();
        }

        isTouching.current = false;
    };

    return (
        <div className="md:hidden mb-20 px-4">
            <div className="relative w-full max-w-md mx-auto">
                {/* SLIDER */}
                <div
                    className="relative overflow-hidden rounded-xl"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {eventDetails.map((event, i) => (
                            <div key={i} className="w-full shrink-0 px-2">
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* DOTS */}
                <div className="flex justify-center mt-10 gap-2">
                    {eventDetails.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${index === i ? "bg-primary" : "bg-primary/30"
                                }`}
                        />
                    ))}
                </div>

                {/* ARROWS */}
                <button
                    onClick={prev}
                    className="absolute left-10 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur border border-primary shadow flex items-center justify-center"
                >
                    <ChevronLeft className="text-primary" />
                </button>

                <button
                    onClick={next}
                    className="absolute right-10 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur border border-primary shadow flex items-center justify-center"
                >
                    <ChevronRight className="text-primary" />
                </button>
            </div>
        </div>
    );
};

export default EventCarousel;
