import React, { useMemo, useState } from "react";
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
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const robotOptions = ["WHIZBOT", "WHIZBUDDY", "WHIZGREETER", "WHIZAARU"];

const socialLinks = [
  { href: "https://www.facebook.com/whizrobo/", icon: FaFacebookF },
  { href: "https://www.instagram.com/whizrobo_/", icon: FaInstagram },
  { href: "https://in.linkedin.com/company/whizrobo", icon: FaLinkedinIn },
  { href: "https://api.whatsapp.com/send/?phone=9464214000&text=Hi%2C+Whizrobo", icon: FaWhatsapp },
];

const fieldClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EC7B21]/40";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    quantity: "",
    robotName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showQuantity = useMemo(() => Boolean(formData.robotName), [formData.robotName]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.company.trim(),
        robotName: formData.robotName.trim(),
        quantity: formData.quantity ? Number(formData.quantity) : undefined,
        message: formData.message.trim(),
      };

      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.msg || "Unable to submit the request.");
        return;
      }

      toast.success("Thanks! Our team will reach out shortly.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        quantity: "",
        robotName: "",
        message: "",
      });
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section
        className="relative min-h-screen overflow-hidden bg-white px-6 py-14 md:py-16"
      >
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-black tracking-tight">
              Let&apos;s plan your robotics and AI journey
            </h1>
            <p className="mt-3 text-black/70 text-base md:text-lg max-w-3xl mx-auto">
              Tell us which robot you want to explore. Our team will share the right fit for your school or organization.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="rounded-3xl border border-black/10 shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
              <div className="h-full rounded-3xl bg-white p-6 sm:p-8 text-center flex flex-col items-center justify-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black">Get in touch</h2>
                <div className="mt-6 w-full space-y-4 text-black/70">
                  <div className="flex items-center justify-center gap-3">
                    <FaPhoneAlt className="text-[#EC7B21] mt-1" />
                    <span className="font-medium">+91-896-871-4000, +91-946-421-4000</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <FaEnvelope className="text-[#EC7B21] mt-1" />
                    <span className="font-medium">
                      <a href="mailto:info@whizrobo.com" className="hover:text-[#EC7B21] transition">info@whizrobo.com</a> |{" "}
                      <a href="mailto:support@whizrobo.com" className="hover:text-[#EC7B21] transition">support@whizrobo.com</a>
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <FaMapMarkerAlt className="text-[#EC7B21] mt-1" />
                    <span className="font-medium">WHIZROBO PRIVATE LIMITED, INDIA</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <FaFileAlt className="text-[#EC7B21] mt-1" />
                    <span className="font-medium">
                      <Link to="/privacy-policy" className="hover:text-[#EC7B21] transition">Privacy Policy</Link> |{" "}
                      <Link to="/terms-and-conditions" className="hover:text-[#EC7B21] transition">Terms & Conditions</Link>
                    </span>
                  </div>
                </div>

                <div className="mt-8 w-full">
                  <h3 className="text-sm font-bold text-black tracking-wide">Follow us</h3>
                  <div className="mt-3 flex items-center justify-center gap-3">
                    {socialLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-[#EC7B21] bg-white hover:bg-black/5 transition"
                        >
                          <Icon size={15} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
              <div className="h-full rounded-3xl bg-white p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black">Request a quote</h2>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <input type="text" name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} className={fieldClass} />
                  <input type="email" name="email" placeholder="Your Email" required value={formData.email} onChange={handleChange} className={fieldClass} />
                  <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className={fieldClass} />
                  <input type="text" name="company" placeholder="School / Company" value={formData.company} onChange={handleChange} className={fieldClass} />

                  <select
                    name="robotName"
                    required
                    value={formData.robotName}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    <option value="" disabled>Select Robot *</option>
                    {robotOptions.map((robot) => (
                      <option key={robot} value={robot}>{robot}</option>
                    ))}
                  </select>

                  {formData.robotName && (
                    <div className="rounded-xl border border-black/10 bg-[#EC7B21]/5 px-3 py-2 text-xs font-semibold text-[#EC7B21]">
                      We will tailor recommendations for {formData.robotName}.
                    </div>
                  )}

                  {showQuantity && (
                    <input
                      type="number"
                      name="quantity"
                      min="1"
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
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-[#EC7B21] text-white font-semibold py-3 transition hover:opacity-90 shadow-sm"
                  >
                    {isSubmitting ? "Submitting..." : "Request Quote"}
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
