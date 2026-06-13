import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, MessageSquare, ArrowRight } from 'lucide-react';
import { OFFICE_CONTACT } from '../data';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const handlePageLink = (id: string) => {
    setCurrentPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="bg-navy-950 text-gray-300 pt-16 pb-8 border-t border-navy-900 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Pitch */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold-500 text-navy-950 font-extrabold text-lg">
                S
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-white tracking-widest leading-none">
                  SWASTIK <span className="text-gold-400">GROUP</span>
                </h3>
                <span className="font-mono text-[9px] tracking-widest text-gold-500/80 uppercase">
                  Est. Lucknow
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              Lucknow&apos;s leading luxury real estate enterprise. We curate premium residential apartments, luxury independent villas, RERA-approved gated township plots, and state-of-the-art corporate plazas built with impeccable Awadhi integrity.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-gray-300 transition-all shadow-sm" aria-label="Facebook Link">
                <Facebook className="w-5.5 h-5.5" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-gray-300 transition-all shadow-sm" aria-label="Instagram Link">
                <Instagram className="w-5.5 h-5.5" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-gray-300 transition-all shadow-sm" aria-label="Twitter Link">
                <Twitter className="w-5.5 h-5.5" />
              </a>
              <a href={`https://wa.me/${OFFICE_CONTACT.whatsapp.replace(/\+/g, '')}`} className="w-9 h-9 flex items-center justify-center rounded-lg bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-gray-300 transition-all shadow-sm" aria-label="WhatsApp Link">
                <MessageSquare className="w-5.5 h-5.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="font-display font-bold text-base text-white mb-6 border-b border-navy-900 pb-2 flex items-center justify-between">
              <span>Quick Links</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-450"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Home Page', id: 'home' },
                { label: 'Properties for Sale', id: 'buy' },
                { label: 'Properties for Rent', id: 'rent' },
                { label: 'All Curated Listings', id: 'properties' },
                { label: 'About Swastik Group', id: 'about' },
                { label: 'Reach Our Office', id: 'contact' },
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handlePageLink(link.id)}
                    className="flex items-center gap-2 hover:text-gold-400 text-gray-400 transition-colors cursor-pointer text-left w-full group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-gold-500 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Active Localities */}
          <div>
            <h4 className="font-display font-bold text-base text-white mb-6 border-b border-navy-900 pb-2 flex items-center justify-between">
              <span>Prime Locations</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-450"></span>
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                'Gomti Nagar Extension',
                'Hazratganj Prime',
                'Vrindavan Yojna Expressway',
                'Shaheed Path Bypass',
                'Sultanpur Road Township',
                'Aliganj Commercial Area'
              ].map((loc, idx) => (
                <li key={idx} className="flex items-center gap-2 hover:text-white transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  <span>{loc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div>
            <h4 className="font-display font-bold text-base text-white mb-6 border-b border-navy-900 pb-2 flex items-center justify-between">
              <span>Contact Us</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-450"></span>
            </h4>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-gray-300 text-sm">{OFFICE_CONTACT.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <div className="space-y-0.5">
                  <a href={`tel:${OFFICE_CONTACT.phone}`} className="hover:text-gold-400 font-semibold transition-colors block text-sm">{OFFICE_CONTACT.phone}</a>
                  <a href={`tel:${OFFICE_CONTACT.phoneSec}`} className="hover:text-gold-400 transition-colors block text-gray-400">{OFFICE_CONTACT.phoneSec}</a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a href={`mailto:${OFFICE_CONTACT.email}`} className="hover:text-gold-400 transition-colors text-sm break-all">{OFFICE_CONTACT.email}</a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span className="text-gray-400 text-xs italic leading-relaxed">{OFFICE_CONTACT.timings}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer / RERA Notice */}
        <div className="border-t border-navy-900 pt-8 mt-8 text-center md:text-left">
          <p className="text-[11px] leading-relaxed text-gray-500 text-justify">
            <span className="text-gold-500 font-bold">Disclaimer:</span> Swastik Group is a registered realty solutions firm in Lucknow, Uttar Pradesh. Property layouts, prices, construction pictures, and floor plans displayed on this web catalog are indicative and intended for informational representation only. Real Estate Regulatory Authority (RERA) registered projects display official numbers when listed. Buyers and tenants are requested to conduct thorough site checks and verify legal titles before transactions.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-navy-900 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {currentYear} Swastik Group Realty Solutions. All Rights Reserved. Crafted with Premium Standards for Lucknow.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => handlePageLink('admin')} className="hover:text-gold-450 transition-colors uppercase font-black tracking-widest text-[9px] flex items-center gap-1 cursor-pointer">
              <span>🔒 Admin Portal</span>
            </button>
            <a href="#" className="hover:text-gold-450 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-450 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gold-450 transition-colors font-mono">RERA Certified: UP-APPROVED</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
