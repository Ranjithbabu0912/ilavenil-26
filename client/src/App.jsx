import React, { useEffect, useState } from 'react'
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
import ProtectedRoute from './components/ProtectedRoute'
import SignInPage from './pages/SignInPage'
import Loader from './components/Loader/Loader'
import EventDetails from './components/EventDetails'
import Navbar from './components/Navbar'

const App = () => {

  const [loading, setLoading] = useState(true);
  const [openStatus, setOpenStatus] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(t);
  }, []);


  if (loading) return <Loader />;

  return (
    <div className=''>
      <Navbar onOpenStatus={() => setOpenStatus(true)} />
      <Routes>
        <Route path='/' element={<Home openStatus={openStatus} setOpenStatus={setOpenStatus} />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path='/about' element={<About />} />
        <Route path='/events' element={<Events />} />
        <Route path='/events/:id' element={<EventDetails />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/agenda' element={<Agenda />} />
        <Route path='/rules_and_guidelines' element={<Rules />} />

        <Route path='/RegistrationForm' element={
          <ProtectedRoute>
            <RegistrationForm />
          </ProtectedRoute>
        }
        />

        <Route path='/payment/:id' element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />


        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  )
}

export default App