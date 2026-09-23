import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { UserContext } from "./UserContext";

import LoginPage from "./pages/login/LoginPage.jsx";
import DashboardPage from "./pages/userPages/Dashboard.jsx";

function Routing() {
  //   const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
