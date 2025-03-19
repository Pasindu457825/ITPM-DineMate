import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { LoadingProvider } from "../src/Context/LoadingContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </ThemeProvider>
  </React.StrictMode>
);
