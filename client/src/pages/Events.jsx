import React from 'react'
import { eventDetails } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import EventCard from '../components/EventCard'

const Events = () => {

    const navigate = useNavigate();


    return (
        <div className='mt-30'>
            <h1 className='text-3xl font-bold text-center text-primary'>Events</h1>
            <div className="flex flex-wrap gap-10 md:p-20 p-10 items-center justify-center mb-10">
                {eventDetails.map((event, index) => (
                    <div key={index} onClick={() => navigate(`/events/${event.id}`)}>
                        <EventCard event={event} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Events