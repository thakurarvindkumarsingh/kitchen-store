import { useState } from "react";

function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSignup = async () => {
    const res = await fetch("https://kitchen-store-server.onrender.com/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Signup 📝</h2>

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

      <button onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
}

export default Signup;
