import React, { useState } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaFileAlt,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const kitsData = {
  IOT: [
    { id: 1, name: "WHIZ IOT" },
    { id: 2, name: "WHIZ BT" },
  ],
  WHIZROBO: [
    { id: 3, name: "WHIZ BUILDER" },
    { id: 4, name: "WHIZ CREATOR" },
    { id: 5, name: "WHIZ BOX" },
    { id: 6, name: "WHIZ INNOVATOR" },
    { id: 7, name: "WHIZ INVENTOR" },
  ],
  ROBOTS: [
    { id: 8, name: "WHIZBOT" },
    { id: 9, name: "WHIZ BUDDY" },
    { id: 10, name: "WHIZ GREETER" },
    { id: 11, name: "WHIZ AARU" },
  ],
};

const socialLinks = [
  { href: "https://www.facebook.com/whizrobo/", icon: FaFacebookF },
  { href: "https://www.instagram.com/whizrobo_/", icon: FaInstagram },
  { href: "https://in.linkedin.com/company/whizrobo", icon: FaLinkedinIn },
  { href: "https://api.whatsapp.com/send/?phone=9464214000&text=Hi%2C+Whizrobo", icon: FaWhatsapp },
];

const fieldClass =
  "w-full rounded-xl border border-orange-200/70 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EC7B21]/60";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    selectionType: "",
    selectedItem: "",
    quantity: "",
    message: "",
  });
  const [showQuantity, setShowQuantity] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "selectedItem" && value !== "") setShowQuantity(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Thank you for your inquiry! We'll get back to you shortly.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      selectionType: "",
      selectedItem: "",
      quantity: "",
      message: "",
    });
    setShowQuantity(false);
  };

  return (
    <>
      <section
        className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-amber-50/70 px-6 py-14 md:py-16"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="absolute top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="inline-flex items-center rounded-full border border-orange-200/70 bg-white/70 px-3 py-1 text-xs font-semibold text-orange-700">
              Contact WHIZROBO
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Let&apos;s plan your robotics and AI journey
            </h1>
            <p className="mt-3 text-gray-700 text-base md:text-lg max-w-3xl mx-auto">
              Tell us whether you need kits, robots, or both. Our team will share the right solution for your school or organization.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="rounded-3xl bg-gradient-to-br from-orange-200/70 via-amber-100/50 to-white p-[1px] shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
              <div className="h-full rounded-3xl bg-white/85 backdrop-blur border border-orange-100/60 p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Get in touch</h2>
                <div className="mt-6 space-y-4 text-gray-700">
                  <div className="flex items-start gap-3">
                    <FaPhoneAlt className="text-[#EC7B21] mt-1" />
                    <span className="font-medium">+91-896-871-4000, +91-946-421-4000</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-[#EC7B21] mt-1" />
                    <span className="font-medium">
                      <a href="mailto:info@whizrobo.com" className="hover:text-[#EC7B21] transition">info@whizrobo.com</a> |{" "}
                      <a href="mailto:support@whizrobo.com" className="hover:text-[#EC7B21] transition">support@whizrobo.com</a>
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-[#EC7B21] mt-1" />
                    <span className="font-medium">WHIZROBO PRIVATE LIMITED, INDIA</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaFileAlt className="text-[#EC7B21] mt-1" />
                    <span className="font-medium">
                      <Link to="/privacy-policy" className="hover:text-[#EC7B21] transition">Privacy Policy</Link> |{" "}
                      <Link to="/terms-and-conditions" className="hover:text-[#EC7B21] transition">Terms & Conditions</Link>
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-bold text-gray-900 tracking-wide">Follow us</h3>
                  <div className="mt-3 flex items-center gap-3">
                    {socialLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 text-[#EC7B21] bg-white hover:bg-orange-50 transition"
                        >
                          <Icon size={15} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-orange-200/70 via-amber-100/50 to-white p-[1px] shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
              <div className="h-full rounded-3xl bg-white/85 backdrop-blur border border-orange-100/60 p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Request a quote</h2>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <input type="text" name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} className={fieldClass} />
                  <input type="email" name="email" placeholder="Your Email" required value={formData.email} onChange={handleChange} className={fieldClass} />
                  <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className={fieldClass} />
                  <input type="text" name="company" placeholder="School / Company" value={formData.company} onChange={handleChange} className={fieldClass} />

                  <select
                    name="selectionType"
                    required
                    value={formData.selectionType}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    <option value="" disabled>Select Type *</option>
                    <option value="IOT">IoT Kit</option>
                    <option value="WHIZROBO">Robot Kit</option>
                    <option value="ROBOTS">Robot</option>
                  </select>

                  {formData.selectionType && (
                    <select
                      name="selectedItem"
                      required
                      value={formData.selectedItem}
                      onChange={handleChange}
                      className={fieldClass}
                    >
                      <option value="" disabled>
                        Select {formData.selectionType === "IOT" ? "IoT Kit" : formData.selectionType === "WHIZROBO" ? "Robot Kit" : "Robot"} *
                      </option>
                      {kitsData[formData.selectionType].map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {showQuantity && (
                    <input
                      type="number"
                      name="quantity"
                      required
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="Quantity"
                      className={fieldClass}
                    />
                  )}

                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Additional requirements"
                    value={formData.message}
                    onChange={handleChange}
                    className={fieldClass}
                  />

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-[#EC7B21] to-orange-600 text-white font-semibold py-3 transition hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow-md"
                  >
                    Request Quote
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
