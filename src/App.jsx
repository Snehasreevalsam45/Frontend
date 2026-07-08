import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import NotFount from "./components/NotFount";

function App() {
  const navigate = useNavigate();

  // Token State
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setToken(null);

    alert("Logout Successful!");

    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <Navbar
        token={token}
        onLogoutTrigger={handleLogout}
      />

      {/* Routes */}
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login setToken={setToken} />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup setToken={setToken} />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFount />}
        />

      </Routes>
    </>
  );
}

export default App;