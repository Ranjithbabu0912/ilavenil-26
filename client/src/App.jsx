import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Contact from './pages/Contact'
import RegistrationForm from './pages/RegistrationForm'
import Success from './pages/Success'
import Payment from './pages/Payment'
import Agenda from './pages/Agenda'
import Rules from './pages/Rules'
import Event from './components/Event'
import { eventDetails } from './assets/assets'

const App = () => {



  return (
    <div className=''>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/events' element={<Events />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/agenda' element={<Agenda />} />
        <Route path='/rules_and_guidelines' element={<Rules />} />
        <Route path='/RegistrationForm' element={<RegistrationForm />} />
        <Route path='/payment/:id' element={<Payment />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  )
}

export default App