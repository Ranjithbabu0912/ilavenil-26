import React from 'react'
import { eventDetails } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import EventTile from '../components/EventTile'
const Events = () => {

    const navigate = useNavigate();


    return (
        <div className='mt-28'>
            <EventTile />
        </div>
    )
}

export default Events