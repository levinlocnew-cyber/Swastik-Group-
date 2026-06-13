import React, { useState } from 'react';
import { Mail, Phone, User, Send, Building, CheckCircle2 } from 'lucide-react';
import { api } from '../utils/api';

interface InquiryFormProps {
  propertyId?: string;
  propertyName?: string;
  onSuccess: (msg: string) => void;
}

export default function InquiryForm({ propertyId, propertyName, onSuccess }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: propertyName 
      ? `Dear Swastik Group, I am highly interested in "${propertyName}" (ID: ${propertyId}). Please share RERA allotment details, pricing break-ups, and schedule a site visit.`
      : 'Dear Swastik Group, I am searching for premium properties/plots in Lucknow. Please share details of your hot upcoming projects.'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please provide a valid 10-digit Indian mobile number');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    api.inquiries.submit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: `+91 ${formData.phone.trim()}`,
      message: formData.message.trim(),
      propertyId,
      propertyName
    })
    .then(() => {
      setLoading(false);
      onSuccess(propertyName 
        ? `Inquiry for "${propertyName}" submitted successfully! Swastik Group office will contact you shortly on WhatsApp/Phone.`
        : 'Thank you for reaching out to Swastik Group! Our Lucknow team will call you within the hour.'
      );
      
      // Clear but retain some fields for ease of use
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: propertyName 
          ? `Dear Swastik Group, I am highly interested in "${propertyName}" (ID: ${propertyId}). Please share RERA allotment details, pricing break-ups, and schedule a site visit.`
          : 'Dear Swastik Group, I am searching for premium properties/plots in Lucknow. Please share details of your hot upcoming projects.'
      });
    })
    .catch((err) => {
      setLoading(false);
      setError(err.message || 'Verification failed. Please try again.');
    });
  };

  return (
    <div id="inquiry-box shadow-lg" className="bg-white dark:bg-navy-900 border border-gold-200/50 dark:border-navy-850 p-6 rounded-2xl shadow-xl space-y-4">
      <div className="border-b border-gray-100 dark:border-navy-850 pb-4">
        <h3 className="font-display font-extrabold text-lg text-navy-900 dark:text-white flex items-center gap-2">
          <Building className="w-5 h-5 text-gold-550 shrink-0" />
          {propertyName ? 'Inquire About Property' : 'Express Elite Interest'}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {propertyName ? `Request pricing & brochure schedule for ${propertyName}` : 'Share your budget range & core requirements in Lucknow'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-900/30 rounded-lg">
            {error}
          </div>
        )}

        {/* Input Name */}
        <div className="relative">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-450 dark:text-gray-500" />
            <input
              type="text"
              name="name"
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-navy-950 text-sm font-medium border border-gray-150 dark:border-navy-800 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 dark:text-white outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Input Phone */}
        <div className="relative">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Mobile Number
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-navy-800 dark:text-gold-400">
              +91
            </span>
            <input
              type="tel"
              name="phone"
              pattern="[0-9]{10}"
              placeholder="98765 43210"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-13 pr-4 py-2.5 bg-gray-50 dark:bg-navy-950 text-sm font-medium border border-gray-150 dark:border-navy-800 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 dark:text-white outline-none transition-all"
              maxLength={10}
              required
            />
          </div>
        </div>

        {/* Input Email */}
        <div className="relative">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-450 dark:text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="ramesh@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-navy-950 text-sm font-medium border border-gray-150 dark:border-navy-800 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 dark:text-white outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Input Message */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Message / Specific Intent
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 dark:bg-navy-950 text-sm font-medium border border-gray-150 dark:border-navy-800 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 dark:text-white outline-none transition-all resize-none leading-relaxed"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-205 shadow-md active:scale-97 text-sm ${
            loading
              ? 'bg-gray-250 dark:bg-navy-850 text-gray-450 cursor-not-allowed'
              : 'bg-navy-800 hover:bg-navy-900 dark:bg-gold-500 dark:hover:bg-gold-450 text-white dark:text-navy-950'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white dark:border-navy-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Express Interest Instantly
            </>
          )}
        </button>
      </form>

      <p className="font-mono text-[9px] text-center text-gray-450 tracking-wider">
        🔒 YOUR PRIVACY GUARANTEED • ZERO SPAM • DIRECT SWASTIK GROUP CALL
      </p>
    </div>
  );
}
