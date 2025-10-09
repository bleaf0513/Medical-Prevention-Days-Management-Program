import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Booking from "../pages/Booking";
import Confirmation from "../pages/Confirmation";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDasboard";
import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <PrivateRoute><AdminDashboard /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
