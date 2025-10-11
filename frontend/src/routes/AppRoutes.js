import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CategoryBooking from "../pages/CategoryBooking";
import MyBookings from "../pages/MyBookings";
import Confirmation from "../pages/Confirmation";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDasboard";
import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  const location = useLocation();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookAppointment = () => {
    setShowBookingModal(true);
  };

  return (
    <>
      <AppNavbar onBookAppointment={handleBookAppointment} />
      <Routes>
        <Route path="/" element={<Home showBookingModal={showBookingModal} setShowBookingModal={setShowBookingModal} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking/:category" element={<CategoryBooking />} />
        <Route path="/my-bookings" element={
          <PrivateRoute><MyBookings /></PrivateRoute>
        } />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* <Route path="/admin/dashboard" element={
          <PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>
        } /> */}

        <Route path="/admin/dashboard" element={
          <AdminDashboard />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
