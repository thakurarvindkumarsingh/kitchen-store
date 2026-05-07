import { useState } from "react";

function Checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const placeOrder = async () => {

    // 🔴 VALIDATION
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all details");
      return;
    }

    if (form.phone.length !== 10) {
      alert("Enter valid 10 digit phone number");
      return;
    }

    const orderData = {
      ...form,
      items: cart,
      total
    };

    await fetch("https://kitchen-store-server.onrender.com/orders/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    alert("Order Placed Successfully 🎉");

    localStorage.removeItem("cart");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Checkout 🧾</h1>

      <h3>Total: ₹ {total}</h3>

      <input
        placeholder="Full Name"
        value={form.name}
        onChange={(e)=>setForm({...form, name:e.target.value})}
      />

      <br /><br />

      <input
        placeholder="Phone Number"
        value={form.phone}
        onChange={(e)=>setForm({...form, phone:e.target.value})}
      />

      <br /><br />

      <textarea
        placeholder="Full Address"
        value={form.address}
        onChange={(e)=>setForm({...form, address:e.target.value})}
      />

      <br /><br />

      <button onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

export default Checkout;
