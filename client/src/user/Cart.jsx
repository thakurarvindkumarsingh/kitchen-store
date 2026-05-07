import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  // 🔄 Cart Update Helper (Navbar ko batane ke liye)
  const syncCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Custom event dispatch taaki Navbar turant update ho jaye
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ➕ Quantity Badhao/Ghatao
  const updateQuantity = (index, type) => {
    let updatedCart = [...cart];
    if (type === "inc") {
      updatedCart[index].quantity += 1;
    } else {
      if (updatedCart[index].quantity > 1) {
        updatedCart[index].quantity -= 1;
      } else {
        if (window.confirm("Remove this item from cart?")) {
          updatedCart.splice(index, 1);
        }
      }
    }
    syncCart(updatedCart);
  };

  // ❌ Remove Item
  const removeItem = (index) => {
    if (window.confirm("Delete this item?")) {
      let updatedCart = cart.filter((_, i) => i !== index);
      syncCart(updatedCart);
    }
  };

  // 💰 Total Calculation
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address || cart.length === 0) {
      alert("Please fill all details & add items ❌");
      return;
    }

    const orderData = { ...form, items: cart, total: total };

    try {
      const res = await fetch("http://localhost:5000/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        alert("Order Placed 🎉");
        localStorage.removeItem("cart");
        syncCart([]);
        navigate("/");
      }
    } catch (err) {
      alert("Server error, try again!");
    }
  };

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-container">
        <h1 style={{ textAlign: 'center', margin: '30px 0' }}>🛒 Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ fontSize: '18px', color: '#64748b' }}>Your cart is empty 😢</p>
            <button className="btn" style={{ width: '200px', marginTop: '20px' }} onClick={() => navigate("/")}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="cart-grid">

            {/* LEFT SIDE: ITEMS LIST */}
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-card">
                  <img
                    src={item.images?.[0] || "https://via.placeholder.com/150"}
                    alt={item.name}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
                    <p style={{ margin: '0', color: '#059669', fontWeight: '700' }}>₹ {item.price}</p>
                  </div>

                  {/* 🔢 Quantity Controls */}
                  <div className="qty-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '5px 12px', borderRadius: '8px' }}>
                    <button onClick={() => updateQuantity(index, "dec")} style={{ border: 'none', cursor: 'pointer', background: 'none', fontSize: '18px' }}>-</button>
                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, "inc")} style={{ border: 'none', cursor: 'pointer', background: 'none', fontSize: '18px' }}>+</button>
                  </div>

                  <button onClick={() => removeItem(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', marginLeft: '10px' }}>
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE: ORDER SUMMARY */}
            <div className="cart-summary">
              <h2 style={{ marginTop: 0 }}>Order Summary</h2>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <span style={{ fontWeight: '500' }}>Grand Total:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669' }}>₹ {total}</span>
              </div>

              {/* 🔥 CONTINUE SHOPPING BUTTON */}
              <button
                onClick={() => navigate("/")}
                style={{ width: '100%', padding: '10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px', fontWeight: '600', color: '#1e293b' }}
              >
                🛍️ Continue Shopping
              </button>

              <h3>Shipping Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input type="number" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <textarea placeholder="Full Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ minHeight: '100px' }} />
              </div>

              <button className="btn" style={{ background: '#f59e0b', marginTop: '20px' }} onClick={placeOrder}>
                Place Order 📦
              </button>
            </div>

          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Cart;