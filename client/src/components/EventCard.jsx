import { MapPin, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer md:h-auto md:w-80 md:hover:scale-110 md:active:scale-100 transition">
            <div className="aspect-video relative">
                <img
                    src="/gradientBackground.png"
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            </div>

            <div className="p-4 space-y-3">
                <h3 className="font-bold text-lg">{event.name}</h3>

                <div className="text-sm text-gray-500 space-y-2">
                    <p className="flex items-center gap-2">
                        <MapPin className="h-4 text-primary" />
                        {event.location}
                    </p>
                    <p className="flex items-center gap-2">
                        <Clock className="h-4 text-primary" />
                        {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                        <Users className="h-4 text-primary" />
                        Team: {event.noOfPart}
                    </p>
                </div>

                <button className="mt-3 px-4 py-1.5 rounded-full bg-primary text-white text-sm">
                    Details
                </button>
            </div>
        </div>
    );
};

export default EventCard