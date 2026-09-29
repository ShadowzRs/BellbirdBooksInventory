import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { UserContext } from "./UserContext";

import LoginPage from "./pages/login/LoginPage.jsx";
import DashboardPage from "./pages/userPages/Dashboard.jsx";
import StockPage from "./pages/stock/StockPage.jsx";
import FullStockListPage from "./pages/stock/FullStockListPage.jsx";
import NewOrderPage from "./pages/orders/NewOrderPage.jsx";
import SearchOrderPage from "./pages/orders/SearchOrderPage.jsx";

function Routing() {
  //   const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/stock" element={<StockPage />} />
        <Route path="/stock/all" element={<FullStockListPage />} />
        <Route path="/orders/new" element={<NewOrderPage />} />
        <Route path="/orders/search" element={<SearchOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;