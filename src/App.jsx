import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./components/LoginPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
