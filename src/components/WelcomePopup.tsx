import React, { useState, useEffect } from 'react';
import { X, Send, Phone, User, Mail, ShieldCheck, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { api } from '../utils/api';

interface WelcomePopupProps {
  onToast: (message: string, type: 'success' | 'info') => void;
}

export default function WelcomePopup({ onToast }: WelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('residential');
  const [message, setMessage] = useState('I am looking for premium properties/plots in Lucknow. Please share details of your upcoming certified projects and schedule a secure consultation call.');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Clear any previous blockages to guarantee the popup is unblocked for testing
    try {
      localStorage.removeItem('swastik_popup_dismissed_or_submitted');
      sessionStorage.removeItem('swastik_popup_dismissed_or_submitted');
    } catch (e) {
      // Ignored
    }

    // Show after a comfortable 1.2 second delay to let the page load smoothly
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
  };

  const handleSnooze = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please provide your full name.');
      return;
    }
    if (!trimmedPhone || trimmedPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);

    try {
      const fullMessage = `[Instant Welcome Lead - Interest: ${interest.toUpperCase()}] ${message}`;
      const payload = {
        name: trimmedName,
        email: trimmedEmail || 'no-email-provided@swastik.in',
        phone: trimmedPhone.startsWith('+91') ? trimmedPhone : `+91 ${trimmedPhone}`,
        message: fullMessage,
        propertyName: `Welcome Consultation (${interest})`
      };

      await api.inquiries.submit(payload);
      
      setIsSuccess(true);
      onToast('Welcome inquiry submitted successfully! A Swastik relationship executive will call back shortly.', 'success');
      
      // Close modal automatically after 2.5 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);

    } catch (err: any) {
      setError(err.message || 'Transmission error. Please check your network and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-fade-in"
      id="welcome-lead-popup-overlay"
    >
      <div 
        className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-navy-900 rounded-3xl border border-gold-400/30 shadow-[0_20px_50px_rgba(180,140,50,0.15)] text-left animate-in zoom-in-95 duration-250 flex flex-col"
        id="welcome-lead-popup-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-2 bg-gradient-to-r from-gold-400 via-gold-550 to-navy-900" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-navy-900 dark:hover:text-gold-400 rounded-full hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors cursor-pointer"
          aria-label="Dismiss callback invitation"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 space-y-5">
          {/* Header */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-400/10 text-gold-600 dark:text-gold-400 text-[10px] font-black uppercase tracking-widest rounded-full">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-gold-500" />
              Swastik Executive Assist
            </span>
            <h3 className="font-display font-black text-2xl text-navy-950 dark:text-white leading-tight">
              Unlock Verified Lucknow Listings & Pricing
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Don&apos;t search alone. Leave a brief callback request to discover verified RERA-approved plots, premium flats, and pre-launch pricing.
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 px-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 font-black" />
              </div>
              <h4 className="font-display font-bold text-lg text-emerald-800 dark:text-emerald-400">
                Thank You for Contacting Swastik Group!
              </h4>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 max-w-sm mx-auto leading-relaxed font-semibold">
                Our team will contact you shortly on Phone/WhatsApp to share details & schedule a site visit.
              </p>
            </div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              {/* Grid 1: Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-navy-800 dark:text-gray-300 uppercase tracking-wider block">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Anmol Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-800/80 rounded-xl text-xs font-medium text-navy-950 dark:text-white outline-none focus:border-gold-550 focus:ring-1 focus:ring-gold-550 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-navy-800 dark:text-gray-300 uppercase tracking-wider block">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile (e.g. 9876543210)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-800/80 rounded-xl text-xs font-mono text-navy-950 dark:text-white outline-none focus:border-gold-550 focus:ring-1 focus:ring-gold-550 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 2: Email and Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-navy-800 dark:text-gray-300 uppercase tracking-wider block">
                    Email Address <span className="text-gray-400 text-[9px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="e.g. anmol@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-800/80 rounded-xl text-xs font-medium text-navy-950 dark:text-white outline-none focus:border-gold-550 focus:ring-1 focus:ring-gold-550 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-navy-800 dark:text-gray-300 uppercase tracking-wider block">
                    Property Interest
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-800/80 rounded-xl text-xs font-medium text-navy-950 dark:text-white outline-none focus:border-gold-550 focus:ring-1 focus:ring-gold-550 transition-all cursor-pointer"
                  >
                    <option value="residential">Residential Flats / Apartm.</option>
                    <option value="plots">Premium Plots / Land</option>
                    <option value="villas">Independent Luxury Villas</option>
                    <option value="commercial">Commercial / Retail Shops</option>
                  </select>
                </div>
              </div>

              {/* Custom Message Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-navy-800 dark:text-gray-300 uppercase tracking-wider block">
                  Describe what you are looking for
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details like expected area, specific lucknow localities, budget, etc."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-800/80 rounded-xl text-xs font-medium text-navy-950 dark:text-white outline-none focus:border-gold-550 focus:ring-1 focus:ring-gold-550 transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Callback Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-navy-800 dark:hover:bg-navy-750 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                >
                  I&apos;ll browse first
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:flex-1 py-3 bg-gold-500 hover:bg-gold-450 active:scale-[0.98] text-navy-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Lead...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Request VIP Call-Back</span>
                    </>
                  )}
                </button>
              </div>

              {/* RERA Certified and Securuty Badges */}
              <div className="pt-2 border-t border-gray-100 dark:border-navy-800 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                  <span>Real-time Secure Connection</span>
                </span>
                <span>RERA Approved Assurances</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
