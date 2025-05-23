'use client';
import React, { useState } from 'react';

const BOOKING_API_URL = process.env.NEXT_PUBLIC_BOOKING_API_URL as string;
const FORM_ID = '69871d4';
if (!BOOKING_API_URL) {
  throw new Error('Contact API URL is not set. Please define NEXT_PUBLIC_BOOKING_API_URL in your .env.local file.');
}

const TOUR_OPTIONS = [
  'Night Safari Drive',
  'Sundowner Wild Cocktail',
  'Bird Trail',
  'Night Walk',
  'Cycling to "Hena"',
  'Bike Ride to Village',
  'Jungle Kayaking',
];

export default function BookingForm() {
  const [form, setForm] = useState({
    FirstName: '',
    'your-email': '',
    Phone: '',
    ArrivalDate: '',
    DepartureDate: '',
    ArrivalTime: '',
    DepartureTime: '',
    Pax: '',
    InterestedTour: [] as string[],
    SpecialRequests: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(option => option.value);
    setForm({ ...form, InterestedTour: selected });
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(BOOKING_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: FORM_ID,
          ...form,
          InterestedTour: form.InterestedTour.join(', '),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setForm({ FirstName: '', 'your-email': '', Phone: '', ArrivalDate: '', DepartureDate: '', ArrivalTime: '', DepartureTime: '', Pax: '', InterestedTour: [], SpecialRequests: '' });
        showNotification(data.message || 'Thank you! Your booking has been sent.', 'success');
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
      <div className="text-sm text-gray-500 font-medium mb-2 text-center">Book your tour using the form below</div>
      {notification && (
        <div
          className={`mb-4 rounded-lg text-center font-medium flex items-center justify-center gap-2 p-3 ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} shadow`}
        >
          {notification.message}
        </div>
      )}
      <label className="text-sm font-medium text-gray-700">Full Name
        <input
          name="FirstName"
          placeholder="Full Name"
          value={form.FirstName}
          onChange={handleChange}
          required
          className="p-3 rounded-md border border-gray-200 text-base w-full mt-1"
        />
      </label>
      <div className="flex gap-3 flex-wrap">
        <label className="flex-1 min-w-0 text-sm font-medium text-gray-700">Phone
          <input
            name="Phone"
            type="tel"
            placeholder="Phone Number"
            value={form.Phone}
            onChange={handleChange}
            required
            className="p-3 rounded-md border border-gray-200 text-base w-full mt-1"
          />
        </label>
        <label className="flex-1 min-w-0 text-sm font-medium text-gray-700">Email Address
          <input
            name="your-email"
            type="email"
            placeholder="Email Address"
            value={form['your-email']}
            onChange={handleChange}
            required
            className="p-3 rounded-md border border-gray-200 text-base w-full mt-1"
          />
        </label>
      </div>
      <div className="flex gap-3 flex-wrap">
        <label className="flex-1 min-w-0 text-sm font-medium text-gray-700">Arrival Date
          <input
            name="ArrivalDate"
            type="date"
            value={form.ArrivalDate}
            onChange={handleChange}
            required
            className="p-3 rounded-md border border-gray-200 text-base w-full mt-1"
          />
        </label>
        <label className="flex-1 min-w-0 text-sm font-medium text-gray-700">Departure Date
          <input
            name="DepartureDate"
            type="date"
            value={form.DepartureDate}
            onChange={handleChange}
            required
            className="p-3 rounded-md border border-gray-200 text-base w-full mt-1"
          />
        </label>
      </div>
      <div className="flex gap-3 flex-wrap">
        <label className="flex-1 min-w-0 text-sm font-medium text-gray-700">Time of Arrival
          <input
            name="ArrivalTime"
            type="time"
            value={form.ArrivalTime}
            onChange={handleChange}
            required
            className="p-3 rounded-md border border-gray-200 text-base w-full mt-1"
          />
        </label>
        <label className="flex-1 min-w-0 text-sm font-medium text-gray-700">Time of Departure
          <input
            name="DepartureTime"
            type="time"
            value={form.DepartureTime}
            onChange={handleChange}
            required
            className="p-3 rounded-md border border-gray-200 text-base w-full mt-1"
          />
        </label>
      </div>
      <label className="text-sm font-medium text-gray-700">Number of People (Pax)
        <input
          name="Pax"
          type="number"
          placeholder="Number of People (Pax)"
          value={form.Pax}
          onChange={handleChange}
          required
          min={1}
          className="p-3 rounded-md border border-gray-200 text-base w-full mt-1"
        />
      </label>
      <label className="text-sm font-medium text-gray-700">Interested Tour(s)
        <select
          name="InterestedTour"
          multiple
          value={form.InterestedTour}
          onChange={handleTourChange}
          required
          className="p-3 rounded-md border border-gray-200 text-base w-full mt-1 h-32"
        >
          {TOUR_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400">(Hold Ctrl or Cmd to select multiple)</span>
      </label>
      <label className="text-sm font-medium text-gray-700">Special Requests (optional)
        <textarea
          name="SpecialRequests"
          placeholder="Special Requests (optional)"
          value={form.SpecialRequests}
          onChange={handleChange}
          className="min-h-[80px] p-3 rounded-md border border-gray-200 text-base w-full mt-1"
        />
      </label>
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`mt-2 p-3 rounded-full bg-[#222] text-white font-bold text-lg tracking-wide border-none transition-colors ${status === 'loading' ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary cursor-pointer'}`}
      >
        {status === 'loading' ? 'Booking...' : 'BOOK NOW'}
      </button>
    </form>
  );
} 