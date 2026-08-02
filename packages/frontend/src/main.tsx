import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./presentation/App";
import { ThemeProvider } from "./presentation/theme/theme-context";
import "./presentation/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);