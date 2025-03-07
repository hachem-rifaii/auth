import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute: React.FC = () => {
  const { user, fetchUser } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      fetchUser(); 
    }
  }, [user, fetchUser]);

  if (!user) {
    console.log("🔴 User not found! Redirecting to login...");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
