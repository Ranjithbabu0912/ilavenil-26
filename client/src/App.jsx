import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import RegistrationForm from "./pages/RegistrationForm";
import Success from "./pages/Success";
import Payment from "./pages/Payment";
import Agenda from "./pages/Agenda";
import Rules from "./pages/Rules";
import SignInPage from "./pages/SignInPage";
import EventDetails from "./components/EventDetails";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader/Loader";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./admin/AdminDashboard";
import AdminQRScanner from "./admin/AdminQRScanner";
import UserRoute from "./components/UserRoute";
import MyQR from "./components/MyQR";
import AdminLayout from "./admin/AdminLayout";
import ScrollToTop from "./components/ScrollTop";
import AdminLiveCounter from "./admin/AdminLiveCounter";
import AdminRegistrationsTable from "./admin/AdminRegistrationsTable";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [openStatus, setOpenStatus] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar onOpenStatus={() => setOpenStatus(true)} />

      <ScrollToTop />
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home openStatus={openStatus} setOpenStatus={setOpenStatus} />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/rules_and_guidelines" element={<Rules />} />

        {/* USER PROTECTED */}
        <Route path="/register" element={<RegistrationForm />} />


        <Route
          path="/my-qr"
          element={
            <UserRoute>
              <MyQR />
            </UserRoute>
          }
        />

        <Route
          path="/payment/:id"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route path="/success" element={<Success />} />


        {/* 🔥 ADMIN ONLY */}

        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route
            path="payments"
            element={
              <AdminDashboard />
            }
          />
          <Route
            path="attendance"
            element={
              <AdminQRScanner />
            }
          />

          <Route
            path="analysis"
            element={
              <AdminLiveCounter />
            }
          />

          <Route
            path="applications"
            element={
              <AdminRegistrationsTable />
            }
          />



        </Route>

      </Routes>
    </div >
  );
};

export default App;
