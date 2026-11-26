import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider";
import StudentsProvider from "./context/StudentsProvider";
import ThemeProvider from "./components/ui/ThemeProvider.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <ToastProvider>
            <AuthProvider>
              <StudentsProvider>
                <App />
              </StudentsProvider>
            </AuthProvider>
          </ToastProvider>
        </MotionConfig>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
