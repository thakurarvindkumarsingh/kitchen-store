import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  // 🔄 Cart Count ko update karne ka function
  const updateNavbarCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Total items ki quantity count kar rahe hain (Quantity logic ke saath)
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCount(total);
  };

  useEffect(() => {
    // Pehli baar load hone par count set karo
    updateNavbarCount();

    // 🔔 Listen for 'storage' event (jab doosre tab/page se cart badle)
    window.addEventListener("storage", updateNavbarCount);

    // 🛠️ Custom event listener (usi page par turant update ke liye)
    window.addEventListener("cartUpdated", updateNavbarCount);

    return () => {
      window.removeEventListener("storage", updateNavbarCount);
      window.removeEventListener("cartUpdated", updateNavbarCount);
    };
  }, []);

  return (
    <div className="navbar">
      {/* LOGO */}
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
        <span>AV Kitchen Mart</span>
      </div>

      <div className="nav-actions">
        {/* CART BUTTON */}
        <button
          className="nav-btn"
          onClick={() => navigate("/cart")}
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          🛒 <span style={{
            background: count > 0 ? "#f59e0b" : "transparent",
            padding: count > 0 ? "2px 8px" : "0",
            borderRadius: "10px",
            fontSize: "12px"
          }}>
            {count}
          </span>
        </button>

        {/* LOGIN/PROFILE BUTTON */}
        <button
          className="nav-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        {/* <button
          className="nav-btn"
          onClick={() => navigate("/orders")}
        >
          Orders
        </button> */}
      </div>
    </div>
  );
}

export default Navbar;