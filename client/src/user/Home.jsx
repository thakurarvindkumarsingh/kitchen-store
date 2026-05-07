import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import ContactBar from "../components/ContactBar";

function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 🔥 Search feature ke liye
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  // 🔄 Load Products + Cart Count
  useEffect(() => {
    fetch("https://kitchen-store-server.onrender.com")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });

    updateCartCount();
    
    // Listen for storage changes from other pages
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  // 🔄 Live Cart Count Update
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Total quantity count (agar 1 product ki quantity 2 hai to count badhega)
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(totalItems);
  };

  // 🛒 Add to Cart with Quantity Logic
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check karo kya product pehle se cart mein hai?
    const existingItemIndex = cart.findIndex((item) => item._id === product._id);

    if (existingItemIndex !== -1) {
      // Agar hai, to quantity +1 kar do
      cart[existingItemIndex].quantity += 1;
    } else {
      // Agar naya hai, to quantity: 1 ke saath add karo
cart.push({
  ...product,
  images: product.images || [product.image], // fallback
  quantity: 1
});
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    updateCartCount();

    setMessage("Added to cart 🛒");
    setTimeout(() => setMessage(""), 2000);
  };

  // 🔥 FILTER (Category + Price + Search)
  const filteredProducts = products.filter((p) => {
    const matchCategory = category === "All" || p.category === category;
    const matchPrice = price === "" || Number(p.price) <= Number(price);
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchCategory && matchPrice && matchSearch;
  });

  // 🔄 Loading UI
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2 style={{ color: '#0f172a' }}>Loading Kitchen Products... ⏳</h2>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc" }}>
      {/* 🔔 Toast Notification */}
      {message && <div className="toast">{message}</div>}

      {/* NAVBAR */}
      <Navbar cartCount={cartCount} />

      {/* HERO SECTION */}
      <Hero />

      {/* 🧩 SEARCH & FILTERS SECTION */}
      <div style={{ 
        maxWidth: "800px", 
        margin: "20px auto", 
        padding: "0 20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
           <input
            type="text"
            placeholder="Search for tools, utensils... 🔍"
            style={{
              width: "100%",
              padding: "12px 20px",
              borderRadius: "50px",
              border: "1px solid #e2e8f0",
              outline: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Price & Category Label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <Categories 
                setCategory={setCategory} 
                activeCategory={category}
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '5px 15px', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Max Price:</span>
                <input
                    type="number"
                    placeholder="₹ Any"
                    style={{
                        padding: "5px",
                        border: "none",
                        outline: "none",
                        width: "80px",
                        fontWeight: 'bold',
                        color: '#059669'
                    }}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* 🛒 Products Grid */}
      <div className="products">
        {filteredProducts.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px" }}>
            <h2 style={{ color: '#64748b' }}>No products found in this range 😢</h2>
            <button className="btn" style={{ width: '200px', marginTop: '10px' }} onClick={() => {setSearchTerm(""); setPrice(""); setCategory("All")}}>
                Reset Filters
            </button>
          </div>
        ) : (
          filteredProducts.map((item) => (
            <div 
              key={item._id} 
              className="card"
              onClick={() => navigate(`/product/${item._id}`)}
            >
              {/* Image with container to prevent stretch */}
             <img src={item.images?.[0]} alt={item.name} className="card-img" />

              <div className="card-body">
                <h3>{item.name}</h3>
                <p className="price">₹ {item.price}</p>

                <div className="rating">
                  ⭐ {
                    item.ratings?.length > 0
                      ? (item.ratings.reduce((sum, r) => sum + r.value, 0) / item.ratings.length).toFixed(1)
                      : "No rating"
                  }
                </div>

                <button 
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CONTACT + FOOTER */}
      <ContactBar />
      <Footer />
    </div>
  );
}

export default Home;
