import { useNavigate } from "react-router-dom";
import { eventDetails } from "../assets/assets";
import EventCard from './EventCard'
import EventCarousel from "./EventCarousel";

const EventTile = () => {


    const navigate = useNavigate();


    return (
        <div className="flex flex-col items-center">
            <h1 className='text-3xl font-bold mb-12 text-primary'>Events</h1>

            {/* 📱 MOBILE CAROUSEL */}
            <div className="w-full px-4 md:hidden ">
                <EventCarousel />
            </div>

            {/* 💻 DESKTOP GRID */}
            <div className="hidden md:flex flex-wrap gap-10 w-sm md:w-3xl xl:w-7xl items-center justify-center mb-10">
                {eventDetails.map((event, index) => (
                    <div key={index} onClick={() => navigate(`/events/${event.id}`)}>
                        <EventCard event={event} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventTile;
