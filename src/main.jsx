import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from '@vercel/analytics/react';
import OASISDemo from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OASISDemo />
    <Analytics />
  </React.StrictMode>
);
