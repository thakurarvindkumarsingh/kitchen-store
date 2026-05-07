import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!data.user) {
      alert(data.message);
      return;
    }

    if (data.user.role !== "admin") {
      alert("Not Admin ❌");
      return;
    }

    localStorage.setItem("admin", JSON.stringify(data.user));
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Login 👨‍💼</h2>

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AdminLogin;