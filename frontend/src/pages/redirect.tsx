import React from "react";
import { Navigate, redirect } from "react-router-dom";

export function Redirect({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={"/signup"} replace={true} />;
  }
  return children;
}
