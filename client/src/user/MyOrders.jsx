import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "1000px", margin: "auto", padding: "20px" }}>
        <h1>📦 My Orders</h1>

        {orders.length === 0 ? (
          <p>No orders yet 😢</p>
        ) : (
          orders.map((order, i) => (
            <div key={i} style={{
              background: "#fff",
              padding: "20px",
              margin: "20px 0",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
            }}>
              <h3>Order #{i + 1}</h3>
              <p><b>Name:</b> {order.name}</p>
              <p><b>Phone:</b> {order.phone}</p>
              <p><b>Address:</b> {order.address}</p>

              <h4>Items:</h4>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <img src={item.images?.[0]} width="60" />
                  <div>
                    <p>{item.name}</p>
                    <p>₹ {item.price} x {item.quantity}</p>
                  </div>
                </div>
              ))}

              <h3>Total: ₹ {order.total}</h3>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MyOrders;