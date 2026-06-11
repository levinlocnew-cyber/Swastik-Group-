import React from 'react';
import { MapPin, Phone, Mail, Clock, HelpCircle, MessageSquare, Sparkles } from 'lucide-react';
import { OFFICE_CONTACT } from '../data';
import InquiryForm from '../components/InquiryForm';

interface ContactViewProps {
  onToast: (msg: string) => void;
}

export default function ContactView({ onToast }: ContactViewProps) {
  const directQueryTemplates = [
    {
      subject: 'Schedule Site Visit',
      desc: 'Book a luxury AC transport guided tour to our sultanpur road plots or Gomti Nagar villas.',
      msg: 'Hello, I want to book a physical site visit to your upcoming project layouts in Lucknow. Please share calendar options.'
    },
    {
      subject: 'RERA Compliance check',
      desc: 'Request official UP-RERA document registries and land allotment maps.',
      msg: 'Hello Swastik Group, please share RERA registration documents and allotment maps for your active developments.'
    },
    {
      subject: 'Home Loan Assistance',
      desc: 'Check customized monthly EMI schedules and pre-approved bank limits.',
      msg: 'Hello, I need home loan interest rates, bank eligibility checks, and EMI amortization schedules for Swastik buyers.'
    }
  ];

  const handleTemplateWhatsApp = (msg: string) => {
    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/${OFFICE_CONTACT.whatsapp.replace(/\+/g, '')}?text=${encoded}`;
    window.open(url, '_blank', 'referrerPolicy="no-referrer"');
  };

  return (
    <div id="contact-view-rig" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans dark:bg-navy-950 transition-colors">
      
      {/* Title Header */}
      <div className="border-b border-gray-150 dark:border-navy-900 pb-6 mb-8 text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-100 dark:bg-navy-900 text-navy-800 dark:text-gold-450 text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          SWIFT REALTOR ENGAGEMENT
        </div>
        <h2 className="font-display font-black text-3xl text-navy-900 dark:text-white">
          Connect with Swastik Group Lucknow Desk
        </h2>
        <p className="text-sm text-gray-400 font-light">
          Have queries about plots, villas, pricing maps, or registrations? Write to our regional managers or drop into our vibhuti khand office corporate desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT SIDEBAR: Office address, phone, support indicators */}
        <div className="lg:col-span-1 space-y-6 text-left">
          
          <div className="bg-navy-950 text-white p-6 rounded-2xl border border-navy-900 shadow-lg space-y-5">
            <h3 className="font-display font-extrabold text-lg text-white pb-3 border-b border-navy-850 flex items-center justify-between">
              <span>Corporate Headquarters</span>
              <span className="w-2 h-2 rounded-full bg-gold-450 animate-pulse"></span>
            </h3>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-widest text-gray-400 uppercase leading-none font-bold">Office Address</p>
                <p className="text-sm leading-relaxed text-gray-250 font-medium">{OFFICE_CONTACT.address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-widest text-gray-400 uppercase leading-none font-bold">Assistance Numbers</p>
                <a href={`tel:${OFFICE_CONTACT.phone}`} className="text-sm font-bold block text-white hover:underline">{OFFICE_CONTACT.phone}</a>
                <a href={`tel:${OFFICE_CONTACT.phoneSec}`} className="text-xs text-gray-400 block hover:underline">{OFFICE_CONTACT.phoneSec}</a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-widest text-gray-400 uppercase leading-none font-bold">Email Communications</p>
                <a href={`mailto:${OFFICE_CONTACT.email}`} className="text-sm block text-gold-400 hover:underline hover:text-gold-300 break-all">{OFFICE_CONTACT.email}</a>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-widest text-gray-400 uppercase leading-none font-bold">Operational Timing</p>
                <span className="text-xs text-gray-300 block">{OFFICE_CONTACT.timings}</span>
              </div>
            </div>

          </div>

          {/* Quick WhatsApp custom templates trigger */}
          <div className="bg-white dark:bg-navy-900 border border-gray-150 dark:border-navy-900 p-5 rounded-2xl shadow-xs space-y-4">
            <h4 className="font-display font-extrabold text-sm text-navy-900 dark:text-white uppercase tracking-wider">
               ⚡ Instant WhatsApp Queries
            </h4>
            
            <div className="space-y-3">
              {directQueryTemplates.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleTemplateWhatsApp(item.msg)}
                  className="group p-3 border border-gray-100 dark:border-navy-850 hover:border-emerald-400/40 rounded-xl bg-gray-50/50 dark:bg-navy-950/20 cursor-pointer hover:bg-emerald-50/10 transition-colors"
                >
                  <p className="text-xs font-bold text-navy-850 dark:text-white group-hover:text-emerald-500 transition-colors flex items-center justify-between">
                    <span>{item.subject}</span>
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500 opacity-60" />
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MIDDLE TWO COLUMNS: Map & Inquiry Form */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Interactive query entry */}
            <InquiryForm
              onSuccess={onToast}
            />

            {/* Live GMAP Coordinate system */}
            <div className="bg-white dark:bg-navy-900 border border-gray-150 dark:border-navy-900 rounded-2xl overflow-hidden p-3 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="flex-1 w-full h-80 md:h-full lg:h-80 xl:h-full min-h-[280px] rounded-xl overflow-hidden shadow-inner border border-gray-150 dark:border-navy-850 relative bg-gray-50">
                <iframe
                  src={OFFICE_CONTACT.gmapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  title="Swastik Office Location Route map"
                ></iframe>
              </div>
              
              <div className="text-left py-1 px-1">
                <p className="text-[10px] font-mono tracking-widest text-gray-400 font-bold uppercase leading-none">Directions Desk</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  Located near Swastik Tower at Cyber Heights Crossing, Gomti Nagar. Ample basement and valet parking slots available.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
