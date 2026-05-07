import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // Categories ki list (Aap yahan apni marzi se badal sakte hain)
  const categories = ["Cookware", "Appliances", "Storage", "Utensils", "Cleaning", "Others"];

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "", // Dropdown iski value set karega
    description: "",
    images: []
  });

  const admin = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    if (!admin) navigate("/");
    getProducts();
    getOrders();
  }, []);

  const getProducts = async () => {
    const res = await fetch("https://kitchen-store-server.onrender.com/products");
    const data = await res.json();
    setProducts(data);
  };

  const getOrders = async () => {
    const res = await fetch("https://kitchen-store-server.onrender.com/orders");
    const data = await res.json();
    setOrders(data);
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Han delete karo?")) {
      try {
        const res = await fetch(`https://kitchen-store-server.onrender.com/delete/${id}`, {
          method: "DELETE"
        });
        const data = await res.json();
        if (data.success) {
          alert("Order deleted! ✅");
          setOrders(orders.filter((o) => o._id !== id));
        }
      } catch (error) {
        console.log("Delete error", error);
      }
    }
  };

  const addProduct = async () => {
    if (!form.name || !form.price || !form.category) {
      alert("All fields required (including category) ❌");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("description", form.description);
    for (let i =0; i<form.images.length; i++){
      formData.append("images", form.images[i]);
    }

    let url = "https://kitchen-store-server.onrender.com/products/add";
    let method = "POST";

    if (editId) {
      url = `https://kitchen-store-server.onrender.com/products/update/${editId}`;
      method = "PUT";
    }

    await fetch(url, { method, body: formData });
    alert(editId ? "Product Updated ✅" : "Product Added ✅");
    setForm({ name: "", price: "", category: "", description: "", images:[] });
    setEditId(null);
    getProducts();
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Product delete karein?")) {
      await fetch(`https://kitchen-store-server.onrender.com/products/delete/${id}`, { method: "DELETE" });
      getProducts();
    }
  };

  const editProduct = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      category: p.category || "",
      description: p.description || "",
      images: []
    });
  };

  const markDelivered = async (id) => {
    const res = await fetch(`https://kitchen-store-server.onrender.com/orders/deliver/${id}`, {
      method: "PUT"
    });
    const data = await res.json();
    if (data.success) getOrders();
  };

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div>
      <div className="navbar">
        <h2>Admin Panel 👨‍💼</h2>
        <button className="btn" onClick={logout}>Logout</button>
      </div>

      <div className="container">
        {/* ADD PRODUCT FORM - UPDATED WITH DROPDOWN */}
        <div className="card">
          <h3>{editId ? "Edit Product" : "Add Product"}</h3>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Price"
            value={form.price}
            type="number"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          {/* 🔽 CATEGORY DROPDOWN STARTS HERE */}
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              background: "white"
            }}
          >
            <option value="">-- Choose Category --</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
          {/* 🔼 CATEGORY DROPDOWN ENDS HERE */}

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            type="file" multiple
            onChange={(e) => setForm({ ...form, images: e.target.files})}
          />

          <button className="btn" onClick={addProduct}>
            {editId ? "Update Product" : "Add Product"}
          </button>
        </div>

        {/* REST OF YOUR CODE (PRODUCTS GRID, ORDERS) */}
        <h2>Products</h2>
        <div className="grid">
          {products.map((p) => (
            <div key={p._id} className="card">
              <img src={p.images?.[0]} alt="" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
              <p><small>Category: {p.category}</small></p>
              <button className="btn" onClick={() => editProduct(p)}>Edit</button>
              <button className="btn" onClick={() => deleteProduct(p._id)}>Delete</button>
            </div>
          ))}
        </div>

        {/* ... baaki ka orders wala code same rahega ... */}
{/* 🟡 PENDING ORDERS */}
<h2>🟡 Pending Orders</h2>
{orders
  .filter(o => o.status !== "Delivered")
  .map((o) => (
    <div key={o._id} className="card" style={{ borderLeft: "5px solid #f59e0b", marginBottom: "15px" }}>
      <div style={{ padding: "15px" }}>
        <p><b>Name:</b> {o.name}</p>
        
        {/* 🔥 YE WAPAS ADD KIYA HAI */}
        <p><b>Phone:</b> {o.phone}</p>
        <p><b>Address:</b> {o.address}</p>
        
        <p><b>Total:</b> <span style={{ color: "#059669", fontWeight: "bold" }}>₹{o.total}</span></p>
        <p><b>Date:</b> {new Date(o.createdAt).toLocaleString()}</p>
        
        {/* Items list dikhane ke liye (Optional) */}
        <p><b>Items:</b> {o.items?.map(item => `${item.name} (x${item.quantity})`).join(", ")}</p>

        <button 
          className="btn" 
          style={{ background: "#059669", marginTop: "10px", width: "auto", padding: "8px 20px" }} 
          onClick={() => markDelivered(o._id)}
        >
          Mark Delivered ✅
        </button>
      </div>
    </div>
  ))}

        <h2 style={{ marginTop: "40px" }}>🟢 Delivered Orders</h2>
        {orders.filter(o => o.status === "Delivered").map((o) => (
          <div key={o._id} className="card" style={{ opacity: 0.7 }}>
            <p><b>Name:</b> {o.name}</p>
            <p><b>Total:</b> ₹{o.total}</p>
            <p><b>Date:</b> {new Date(o.createdAt).toLocaleString()}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn" style={{ background: "gray" }}>Delivered ✔</button>
              <button className="btn" style={{ background: "red" }} onClick={() => deleteOrder(o._id)}>
                Delete History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard; 
