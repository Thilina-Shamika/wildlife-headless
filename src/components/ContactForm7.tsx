"use client";
import React, { useState } from "react";

interface ContactForm7Props {
  subheading?: string;
  heading?: string;
  backgroundImage?: string;
}

const WP_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL as string;
if (!WP_API_URL) {
  throw new Error("Contact API URL is not set. Please define NEXT_PUBLIC_CONTACT_API_URL in your .env.local file.");
}

export default function ContactForm7({ subheading, heading, backgroundImage }: ContactForm7Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>("idle");
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(WP_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        showNotification(data.message || "Thank you! Your message has been sent.", "success");
      } else {
        setStatus("error");
        showNotification(data.message || "Submission failed", "error");
      }
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) {
        showNotification(err.message || "Submission failed", "error");
      } else {
        showNotification("Submission failed", "error");
      }
    }
  };

  return (
    <section
      style={{
        width: '100%',
        minHeight: '80vh',
        background: backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)), url(${backgroundImage}) center/cover no-repeat`
          : '#222',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: 88,
        paddingBottom: 88,
      }}
    >
      {/* Mobile padding with a style tag */}
      <style>{`
        @media (max-width: 600px) {
          .cf7-section-padding {
            padding: 20px !important;
          }
        }
      `}</style>
      <div className="cf7-section-padding" style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {subheading && (
          <div style={{ color: '#fff', fontSize: 16, marginBottom: 8, marginTop: 0, textAlign: 'center', fontWeight: 400 }}>
            {subheading}
          </div>
        )}
        {heading && (
          <h1 style={{
            color: '#fff',
            fontSize: 56,
            fontWeight: 700,
            margin: 0,
            marginBottom: 32,
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-1px',
          }}>{heading}</h1>
        )}
        <div style={{
          width: '100%',
          maxWidth: 500,
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          padding: '2rem 1.5rem 1.5rem 1.5rem',
          margin: '0 auto',
        }}>
          <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 16, color: '#222' }}>Send us a Message</div>
          {notification && (
            <div
              style={{
                marginBottom: 16,
                borderRadius: 8,
                background: notification.type === 'success' ? '#d1fae5' : '#fee2e2',
                color: notification.type === 'success' ? '#065f46' : '#991b1b',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                textAlign: 'center',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '0.75rem 1rem',
              }}
            >
              {notification.type === 'success' && (
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }}>
                  <circle cx="10" cy="10" r="10" fill="#34D399"/>
                  <path d="M6 10.5L9 13.5L14 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {notification.message}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ddd', fontSize: 16 }}
            />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                style={{ flex: '1 1 180px', minWidth: 0, padding: '0.75rem', borderRadius: 6, border: '1px solid #ddd', fontSize: 16 }}
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                style={{ flex: '1 1 180px', minWidth: 0, padding: '0.75rem', borderRadius: 6, border: '1px solid #ddd', fontSize: 16 }}
              />
            </div>
            <input
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
              style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #ddd', fontSize: 16 }}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              style={{ minHeight: 100, padding: '0.75rem', borderRadius: 6, border: '1px solid #ddd', fontSize: 16 }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                marginTop: 8,
                padding: '0.75rem 0',
                borderRadius: 999,
                background: '#222',
                color: '#fff',
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: 1,
                border: 'none',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {status === "loading" ? "Sending..." : "SEND"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
} 