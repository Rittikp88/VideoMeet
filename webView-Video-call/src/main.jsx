import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider.jsx";
import { FramesSocketProvider } from "./context/FramesSocketProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <SocketProvider>
    <FramesSocketProvider>
      <App />
      </FramesSocketProvider>
    </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
