import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
function ContactBar() {
  return (
    <div className="contact-bar">

      {/* CONTACT */}
      <div className="contact-info">
        <h3>Contact / Support</h3>
        <p>📞 +91 8604452341</p>
        <p>📧 support@kitchenstore.com</p>
      </div>

      {/* SOCIAL ICONS */}
      <div className="social-icons">

        <a href="https://wa.me/918604452341" target="_blank">
          <FaWhatsapp size={25} color="#25D366" />
        </a>

        <a href="https://www.instagram.com/avkitchenmart2003?igsh=dnNxM3VmNzlhN2tw" target="_blank">
          <FaInstagram size={25} color="#E4405F" />
        </a>

        <a href="https://facebook.com/profile.php?id=61582173851410" target="_blank">
          <FaFacebook size={25} color="#1877F2" />
        </a>

      </div>

    </div>
  );
}

export default ContactBar;