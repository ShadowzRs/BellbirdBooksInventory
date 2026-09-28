import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { UserContext } from "./UserContext";

import LoginPage from "./pages/login/LoginPage.jsx";
import DashboardPage from "./pages/userPages/Dashboard.jsx";
import UpdateSecondHandBook from "./pages/userPages/UpdateSecondHandBook.jsx";

function Routing() {
  //   const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/update-second-hand-book" element={<UpdateSecondHandBook />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
