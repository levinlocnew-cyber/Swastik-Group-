import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp, Send, Check } from 'lucide-react';
import { OFFICE_CONTACT } from '../data';

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const [helloMessage, setHelloMessage] = useState('Hello Swastik Group, I am interested in exploring property options in Lucknow. Please share details.');

  // Monitored scroll to trigger back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const initWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(helloMessage);
    const apiurl = `https://wa.me/${OFFICE_CONTACT.whatsapp.replace(/\+/g, '')}?text=${encoded}`;
    window.open(apiurl, '_blank', 'referrerPolicy=no-referrer');
    setChatBoxOpen(false);
  };

  return (
    <>
      {/* Floating Buttons Parent */}
      <div id="floating-support-rig" className="fixed bottom-6 right-6 z-45 flex flex-col items-end space-y-3.5 print:hidden">
        
        {/* Scroll To Top button */}
        {showScrollTop && (
          <button
            id="btn-scroll-top"
            onClick={handleScrollTop}
            className="p-3.5 rounded-full bg-navy-800 hover:bg-gold-550 hover:text-navy-950 text-white dark:bg-gold-500 dark:hover:bg-gold-400 dark:text-navy-950 shadow-xl transition-all hover:-translate-y-1 active:scale-95 cursor-pointer animate-in fade-in zoom-in-75 duration-200"
            aria-label="Scroll Back To Top"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* WhatsApp Custom Interactive Bubble */}
        <div className="relative flex flex-col items-end">
          {/* WhatsApp Live chat-box */}
          {chatBoxOpen && (
            <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-navy-900 rounded-2xl border border-emerald-100 dark:border-emerald-950 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250">
              {/* WhatsApp Header */}
              <div className="bg-emerald-650 p-4 text-white flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-display font-extrabold text-sm">
                    SG
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-650"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-none">Swastik WhatsApp Support</h4>
                  <p className="text-[10px] text-emerald-100 mt-1 leading-none">Online • Quick Response</p>
                </div>
              </div>

              {/* Chat Area */}
              <div className="p-4 bg-emerald-50/20 dark:bg-navy-950 space-y-3 text-xs">
                <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 p-3 rounded-lg text-gray-700 dark:text-gray-300 max-w-[85%] rounded-tl-none font-medium leading-relaxed shadow-xs">
                  🙏 Namaste! Thank you for visiting Swastik Group Lucknow. Need instant RERA details or layout directions? Text our desk directly!
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={initWhatsApp} className="p-3 border-t border-gray-100 dark:border-navy-850 flex gap-2 bg-gray-50 dark:bg-navy-950">
                <input
                  type="text"
                  value={helloMessage}
                  onChange={(e) => setHelloMessage(e.target.value)}
                  placeholder="Type your WhatsApp message..."
                  className="flex-1 px-3 py-2 bg-white dark:bg-navy-900 text-xs text-gray-800 dark:text-white border border-gray-200 dark:border-navy-800 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Core WhatsApp floating trigger */}
          <button
            id="whatsapp-floater"
            onClick={() => setChatBoxOpen(!chatBoxOpen)}
            className="flex items-center gap-2 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer relative"
            title="Chat on WhatsApp"
            aria-label="whatsapp floating buttons"
          >
            {/* Live pulsating green dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full animate-pulse flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
            <svg 
              className="w-6 h-6 fill-current" 
              viewBox="0 0 24 24"
            >
              <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.461 3.483 1.332 5.006L2 22l5.174-1.357c1.47.8 3.111 1.22 4.826 1.22 5.51 0 9.993-4.483 9.993-9.993C21.993 6.483 17.514 2 12.004 2zm5.836 14.199c-.24.674-1.206 1.248-1.742 1.314-.495.06-1.137.078-1.844-.148-.445-.14-1.002-.352-1.7-.655-2.955-1.28-4.87-4.303-5.016-4.502-.147-.197-1.196-1.597-1.196-3.045 0-1.448.74-2.16.103-2.457-.318-.297-.837-.37-1.17-.37s-.863.148-1.314.637c-.45.49-1.72 1.684-1.72 4.11 0 2.425 1.764 4.773 2.01 5.1.246.33 3.411 5.215 8.27 7.314 1.156.498 2.06.795 2.76 1.018 1.164.368 2.228.315 3.066.19.932-.14 1.88-.767 2.143-1.472.261-.704.261-1.309.183-1.439-.078-.13-.287-.208-.596-.363z"/>
            </svg>
          </button>
        </div>

      </div>

      {/* Sticky Bottom Call Banner - Absolute conversion trigger on Mobile / Small screens */}
      <div id="sticky-call-mobile-banner" className="sm:hidden fixed bottom-0 left-0 w-full z-40 bg-navy-950 border-t border-navy-900 py-3.5 px-4 flex items-center justify-between shadow-2xl print:hidden">
        <div className="text-left">
          <p className="text-[10px] font-mono tracking-wider text-gold-400 font-bold uppercase leading-none">
            🚀 Call Swastik Direct
          </p>
          <p className="text-sm font-black text-white mt-1 leading-none">
            {OFFICE_CONTACT.phone}
          </p>
        </div>
        <a
          id="sticky-mobile-phone-btn"
          href={`tel:${OFFICE_CONTACT.phone}`}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-450 text-navy-950 font-extrabold text-xs shadow-md transition-all active:scale-95"
        >
          <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
          Talk To Agent Now
        </a>
      </div>
    </>
  );
}
