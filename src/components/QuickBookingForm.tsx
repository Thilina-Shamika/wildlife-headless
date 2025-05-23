'use client';
import React, { useState } from 'react';
import { MapPin, Calendar, Users, ChevronDown } from 'lucide-react';

const BOOKING_API_URL = process.env.NEXT_PUBLIC_BOOKING_API_URL as string;
const TOUR_OPTIONS = [
  'Night Safari Drive',
  'Sundowner Wild Cocktail',
  'Bird Trail',
  'Night Walk',
  'Cycling to "Hena"',
  'Bike Ride to Village',
  'Jungle Kayaking',
];

export default function QuickBookingForm() {
  const [form, setForm] = useState({
    InterestedTour: '',
    ArrivalDate: '',
    DepartureDate: '',
    Pax: '',
  });
  const [showPopup, setShowPopup] = useState(false);
  const [contact, setContact] = useState({ FirstName: '', 'your-email': '', Phone: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };
  const handleBookClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };
  const handlePopupClose = () => {
    setShowPopup(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(BOOKING_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: '69871d4',
          ...form,
          ...contact,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setForm({ InterestedTour: '', ArrivalDate: '', DepartureDate: '', Pax: '' });
        setContact({ FirstName: '', 'your-email': '', Phone: '' });
        setShowPopup(false);
        showNotification(data.message || 'Thank you! Your booking has been sent.', 'success');
      } else {
        setStatus('error');
        showNotification(data.message || 'Submission failed', 'error');
      }
    } catch (err: unknown) {
      setStatus('error');
      showNotification('Submission failed', 'error');
    }
  };

  return (
    <div className="w-full flex justify-center mt-[-3rem] z-10 relative">
      <form className="bg-white/90 rounded-2xl shadow-lg flex flex-row flex-wrap items-center justify-between px-6 py-4 gap-4 w-full max-w-4xl backdrop-blur-md" onSubmit={handleBookClick}>
        {/* Tours */}
        <div className="flex flex-col items-start flex-1 w-full">
          <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-2"><MapPin className="inline-block w-4 h-4" /> Tour</label>
          <select name="InterestedTour" value={form.InterestedTour} onChange={handleChange} required className="bg-transparent border border-gray-200 rounded-md px-3 py-2 text-base font-medium focus:ring-0 focus:outline-none w-full">
            <option value="" disabled>Select a tour</option>
            {TOUR_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        {/* Arrival */}
        <div className="flex flex-col items-start flex-1 w-full">
          <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-2"><Calendar className="inline-block w-4 h-4" /> Check In</label>
          <input type="date" name="ArrivalDate" value={form.ArrivalDate} onChange={handleChange} required placeholder="yyyy-mm-dd" className="bg-transparent border border-gray-200 rounded-md px-3 py-2 text-base font-medium focus:ring-0 focus:outline-none w-full" />
        </div>
        {/* Departure */}
        <div className="flex flex-col items-start flex-1 w-full">
          <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-2"><Calendar className="inline-block w-4 h-4" /> Check Out</label>
          <input type="date" name="DepartureDate" value={form.DepartureDate} onChange={handleChange} required placeholder="yyyy-mm-dd" className="bg-transparent border border-gray-200 rounded-md px-3 py-2 text-base font-medium focus:ring-0 focus:outline-none w-full" />
        </div>
        {/* People */}
        <div className="flex flex-col items-start flex-1 w-full">
          <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-2"><Users className="inline-block w-4 h-4" /> People</label>
          <input type="number" name="Pax" min={1} placeholder="Adults" value={form.Pax} onChange={handleChange} required className="bg-transparent border border-gray-200 rounded-md px-3 py-2 text-base font-medium focus:ring-0 focus:outline-none w-full" />
        </div>
        {/* Book Button */}
        <button type="submit" className="rounded-full bg-[#17403b] hover:bg-[#1e524b] text-white w-12 h-12 flex items-center justify-center shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary">
          <span className="sr-only">Book the tour</span>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" /><path d="M8 12l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </form>
      {/* Popup Overlay */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fade-in">
            <button onClick={handlePopupClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
            <h2 className="text-xl font-bold mb-4 text-center">Complete Your Booking</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input name="FirstName" placeholder="Full Name" value={contact.FirstName} onChange={handleContactChange} required className="p-3 rounded-md border border-gray-200 text-base w-full" />
              <input name="your-email" type="email" placeholder="Email Address" value={contact['your-email']} onChange={handleContactChange} required className="p-3 rounded-md border border-gray-200 text-base w-full" />
              <input name="Phone" type="tel" placeholder="Phone Number" value={contact.Phone} onChange={handleContactChange} required className="p-3 rounded-md border border-gray-200 text-base w-full" />
              <button type="submit" disabled={status === 'loading'} className="mt-2 p-3 rounded-full bg-[#17403b] text-white font-bold text-lg tracking-wide border-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#1e524b]">{status === 'loading' ? 'Booking...' : 'Finish Booking'}</button>
            </form>
          </div>
        </div>
      )}
      {/* Notification */}
      {notification && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg font-semibold text-center ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{notification.message}</div>
      )}
    </div>
  );
} 