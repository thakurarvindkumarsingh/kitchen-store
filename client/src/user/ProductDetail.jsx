import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactBar from "../components/ContactBar";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(""); // 🔥 main images state
  const [message, setMessage] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetch("https://kitchen-store-server.onrender.com/products")
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p._id === id);
        setProduct(found);

        // 🔥 set first images as main
        if (found?.images?.length > 0) {
          setMainImage(found.images[0]);
        }
      });
  }, [id]);

  // 🛒 ADD TO CART
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(item => item._id === product._id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    setMessage("Added to cart 🛒");
    setTimeout(() => setMessage(""), 2000);
  };

  // ⭐ SUBMIT RATING
  const submitRating = async (val) => {
    try {
      const res = await fetch(`https://kitchen-store-server.onrender.com/products/rate/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });

      if (res.ok) {
        setMessage("Rating submitted ⭐");
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      console.log("Rating error", err);
    }
  };

  if (!product) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;

  const avgRating = product.ratings?.length > 0
    ? (product.ratings.reduce((sum, r) => sum + r.value, 0) / product.ratings.length).toFixed(1)
    : "No rating";

  return (
    <div>
      <Navbar />

      {message && <div className="toast">{message}</div>}

      <div className="detail-container">

        {/* 🔥 IMAGE SECTION */}
        <div className="detail-img">

          {/* MAIN IMAGE */}
          <img
            src={mainImage}
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: "350px",
              objectFit: "contain",
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "10px"
            }}
          />

          {/* 🔥 THUMBNAILS */}
          <div style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
            flexWrap: "wrap"
          }}>
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setMainImage(img)}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: mainImage === img ? "2px solid #059669" : "1px solid #ddd",
                  padding: "3px"
                }}
              />
            ))}
          </div>

        </div>

        {/* INFO SECTION */}
        <div className="detail-info">
          <h2>{product.name}</h2>

          <p className="detail-price">₹ {product.price}</p>

          <div className="rating">
            ⭐ <b>{avgRating}</b> ({product.ratings?.length || 0} reviews)
          </div>

          <p className="desc">
            {product.description || "High quality kitchen product for daily use."}
          </p>

          {/* ⭐ RATING */}
          <div style={{ margin: "20px 0" }}>
            <p>Rate this product:</p>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  fontSize: "24px",
                  cursor: "pointer",
                  color: star <= hoverRating ? "#f59e0b" : "#ccc"
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => submitRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="detail-btns">
            <button className="btn" onClick={addToCart}>
              Add to Cart 🛒
            </button>

            <button
              className="buy-btn"
              onClick={() => {
                addToCart();
                navigate("/cart");
              }}
            >
              Buy Now ⚡
            </button>

            <button className="back-btn" onClick={() => navigate("/")}>
              ⬅ Back
            </button>
          </div>
        </div>
      </div>

      <ContactBar />
      <Footer />
    </div>
  );
}

export default ProductDetail;
