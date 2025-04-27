import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

import ProductList from "./pages/admin/products/ProductList";
import ProductAdd from "./pages/admin/products/ProductAdd";
import ProductEdit from "./pages/admin/products/ProductEdit";
import OrderList from "./pages/admin/orders/OrderList";
import OrderDetail from "./pages/admin/orders/OrderDetail";
import AdminLogin from "./pages/admin/login/AdminLogin";
import UserList from "./pages/admin/user/UserList";
import VoucherList from "./pages/admin/vouchers/VoucherList";
import VoucherAdd from "./pages/admin/vouchers/VoucherAdd";

import Home from "./pages/user/Home";
import CartPage from "./pages/user/cart/CartPage";
import CheckoutPage from "./pages/user/checkout/CheckoutPage";
import OrderHistoryPage from "./pages/user/orders/OrderHistoryPage";
import OrderDetailPage from "./pages/user/orders/OrderDetailPage";
import BuyPage from "./pages/user/buy/BuyPage";
import AddToCartPage from "./pages/user/cart/AddToCartPage";
import Login from "./pages/user/auth/Login";
import Register from "./pages/user/auth/Register";
import OrderPage from "./pages/user/orders/OrderPage";
import UserProductAdd from "./pages/user/products/UserProductAdd";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Đăng nhập Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Layout Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />

          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetail />} />

          <Route path="users" element={<UserList />} />

          <Route path="vouchers" element={<VoucherList />} />
          <Route path="vouchers/add" element={<VoucherAdd />} />
        </Route>

        {/* Layout User */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="buy/:id" element={<BuyPage />} />
          <Route path="cart/add/:id" element={<AddToCartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="orders/history" element={<OrderHistoryPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="products/add" element={<UserProductAdd />} />

          {/* Protected Routes for User */}
          {/* <Route element={<ProtectedRoute />}>
            {/* <Route path="cart" element={<CartPage />} /> */}
          {/* <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders/history" element={<OrderHistoryPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} /> */}
          {/* <Route path="buy/:id" element={<BuyPage />} /> */}
          {/* <Route path="cart/add/:id" element={<AddToCartPage />} /> */}
          {/* </Route>  */}

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
