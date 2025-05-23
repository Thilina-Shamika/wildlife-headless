'use client';
import React, { useState } from 'react';

const WP_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL as string;
if (!WP_API_URL) {
  throw new Error('Contact API URL is not set. Please define NEXT_PUBLIC_CONTACT_API_URL in your .env.local file.');
}

export default function ContactPageForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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
    setStatus('loading');
    try {
      const res = await fetch(WP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setStatus('success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        showNotification(data.message || 'Thank you! Your message has been sent.', 'success');
      } else {
        setStatus('error');
        showNotification(data.message || 'Submission failed', 'error');
      }
    } catch (err: unknown) {
      setStatus('error');
      if (err instanceof Error) {
        showNotification(err.message || 'Submission failed', 'error');
      } else {
        showNotification('Submission failed', 'error');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-lg">
      <div className="text-sm text-gray-500 font-medium mb-2 text-center">Ask your questions and get in touch with us</div>
      {notification && (
        <div
          className={`mb-4 rounded-lg text-center font-medium flex items-center justify-center gap-2 p-3 ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} shadow`}
        >
          {notification.message}
        </div>
      )}
      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="p-3 rounded-md border border-gray-200 text-base"
      />
      <div className="flex gap-3 flex-wrap">
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="flex-1 min-w-0 p-3 rounded-md border border-gray-200 text-base"
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="flex-1 min-w-0 p-3 rounded-md border border-gray-200 text-base"
        />
      </div>
      <input
        name="subject"
        placeholder="Subject"
        value={form.subject}
        onChange={handleChange}
        required
        className="p-3 rounded-md border border-gray-200 text-base"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        required
        className="min-h-[100px] p-3 rounded-md border border-gray-200 text-base"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`mt-2 p-3 rounded-full bg-[#222] text-white font-bold text-lg tracking-wide border-none transition-colors ${status === 'loading' ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary cursor-pointer'}`}
      >
        {status === 'loading' ? 'Sending...' : 'SEND'}
      </button>
    </form>
  );
}