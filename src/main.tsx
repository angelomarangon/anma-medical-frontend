import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import AppRoutes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastContainer />
    <AppRoutes />
  </React.StrictMode>
);
