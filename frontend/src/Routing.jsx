import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage.jsx";
import DashboardPage from "./pages/userPages/Dashboard.jsx";
import UserManagement from "./pages/userPages/UserManagement.jsx";
import AddUser from "./pages/userPages/AddUser.jsx";
import UpdateUser from "./pages/userPages/UpdateUser.jsx";

import AddBookPage from "./pages/stock/AddBookPage.jsx";
import UpdateStock from "./pages/stock/UpdateStock.jsx";
import StockPage from "./pages/stock/StockPage.jsx";
import FullStockListPage from "./pages/stock/FullStockListPage.jsx";

import NewOrderPage from "./pages/orders/NewOrderPage.jsx";
import SearchOrderPage from "./pages/orders/SearchOrderPage.jsx";
import OutstandingOrdersPage from "./pages/orders/OutstandingOrdersPage.jsx";
import EditOrderPage from "./pages/orders/EditOrderPage.jsx";

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/add" element={<AddUser />} />
        <Route path="/users/update/:id" element={<UpdateUser />} />

        {/* Stock/Inventory Routing */}
        <Route path="/stock/:type" element={<AddBookPage />} />
        <Route path="/stock" element={<StockPage />} />
        <Route path="/stock/all" element={<FullStockListPage />} />
        <Route path="/stock/update/:id" element={<UpdateStock />} />

        {/* Order Routing */}
        <Route path="/orders/new" element={<NewOrderPage />} />
        <Route path="/orders/search" element={<SearchOrderPage />} />
        <Route path="/orders/outstanding" element={<OutstandingOrdersPage />} />
        <Route path="/orders/:id/edit" element={<EditOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
