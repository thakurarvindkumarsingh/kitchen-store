import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./user/Home";
import Cart from "./user/Cart";
import Login from "./user/Login";
import Signup from "./user/Signup";
import ProductDetail from "./user/ProductDetail";
import Checkout from "./user/Checkout";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* USER ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;