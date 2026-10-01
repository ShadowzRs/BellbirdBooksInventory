import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage.jsx";
import DashboardPage from "./pages/userPages/Dashboard.jsx";
import UpdateSecondHandBook from "./pages/userPages/UpdateSecondHandBook.jsx";

import AddBookPage from "./pages/stock/AddBookPage.jsx";
import StockPage from "./pages/stock/StockPage.jsx";
import FullStockListPage from "./pages/stock/FullStockListPage.jsx";

import NewOrderPage from "./pages/orders/NewOrderPage.jsx";
import SearchOrderPage from "./pages/orders/SearchOrderPage.jsx";

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/update-second-hand-book" element={<UpdateSecondHandBook />}
/>

        <Route path="/stock/:type" element={<AddBookPage />} />
        <Route path="/stock" element={<StockPage />} />
        <Route path="/stock/all" element={<FullStockListPage />} />

        <Route path="/orders/new" element={<NewOrderPage />} />
        <Route path="/orders/search" element={<SearchOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
