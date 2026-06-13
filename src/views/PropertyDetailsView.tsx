import React, { useState, useEffect } from 'react';
import { MapPin, BedDouble, Bath, Maximize, Landmark, ShieldCheck, Heart, ArrowLeft, Phone, Calendar, Star, HelpCircle } from 'lucide-react';
import { Property, PropertyCategory } from '../types';
import { PROPERTIES_DATA, OFFICE_CONTACT } from '../data';
import { api } from '../utils/api';
import InquiryForm from '../components/InquiryForm';
import PropertyCard from '../components/PropertyCard';

interface PropertyDetailsViewProps {
  propertyId: string;
  onGoBack: () => void;
  onViewSimilarDetails: (id: string) => void;
  onToast: (msg: string) => void;
}

export default function PropertyDetailsView({
  propertyId,
  onGoBack,
  onViewSimilarDetails,
  onToast
}: PropertyDetailsViewProps) {
  
  // Dynamic state query falling back initially to static default item
  const [property, setProperty] = useState<Property | null>(() => {
    return PROPERTIES_DATA.find(p => p.id === propertyId) || null;
  });
  const [allProperties, setAllProperties] = useState<Property[]>(PROPERTIES_DATA);

  useEffect(() => {
    api.properties.get(propertyId).then(data => {
      if (data) setProperty(data);
    });
    api.properties.list().then(data => {
      if (data && data.length > 0) setAllProperties(data);
    });
    setActiveImgIdx(0); // Reset gallery image pointers upon switching IDs
  }, [propertyId]);

  // Active gallery image index
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Fallback if property ID is corrupt
  if (!property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <HelpCircle className="w-16 h-16 text-rose-500 mx-auto" />
        <h3 className="font-display font-bold text-2xl">Property Not Found</h3>
        <p className="text-sm text-gray-500">The listing record might have been archived or deleted from Lucknow databases.</p>
        <button onClick={onGoBack} className="px-5 py-2.5 rounded-xl bg-navy-800 text-white font-bold">
          Back to Listings
        </button>
      </div>
    );
  }

  // Similar items (same category, excluding current one)
  const similarItems = allProperties
    .filter(p => p.category === property.category && p.id !== property.id)
    .slice(0, 3);

  // Fallback similar items if none in same category (just grab featured list)
  const similarShown = similarItems.length > 0 
    ? similarItems 
    : allProperties.filter(p => p.id !== property.id).slice(0, 3);

  // Human category helper
  const categoryLabels: Record<string, string> = {
    residential: 'Premium Residential Plot',
    commercial: 'Commercial Business Project',
    apartment: 'Luxury High-rise Apartment',
    villa: 'Elite Independent Villa',
    plot: 'High-yield Investment Plot'
  };

  const initWhatsApp = () => {
    const message = `Hello Swastik Group, I would like to schedule a site visit and obtain RERA details for "${property.name}" (ID: ${property.id}). Please share details.`;
    const encoded = encodeURIComponent(message);
    const apiurl = `https://wa.me/${OFFICE_CONTACT.whatsapp.replace(/\+/g, '')}?text=${encoded}`;
    window.open(apiurl, '_blank', 'referrerPolicy="no-referrer"');
  };

  return (
    <div id="property-details-shelf" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans dark:bg-navy-950 transition-colors">
      
      {/* 1. Back and Breadcrumb line */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-navy-900 pb-4 mb-6">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-navy-800 dark:text-gold-440 hover:text-gold-550 hover:-translate-x-1 cursor-pointer transition-all duration-200"
          id="btn-back-to-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Curated Listings
        </button>

        <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
          Property ID: <strong className="text-gray-650 dark:text-gray-200">{property.id}</strong>
        </span>
      </div>

      {/* 2. Top Title and Price Segment */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 text-left">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-navy-950 bg-gold-400 rounded-md">
              {categoryLabels[property.category]}
            </span>
            <span className="px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-white bg-slate-800 rounded-md">
              {property.type === 'buy' ? 'For Sale' : 'For Rent'}
            </span>
            {property.reraApproved && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-md border border-emerald-100 dark:border-emerald-900">
                <ShieldCheck className="w-3.5 h-3.5" />
                RERA APPROVED • {property.reraNumber}
              </span>
            )}
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-navy-900 dark:text-white leading-tight">
            {property.name}
          </h1>

          <p className="text-sm font-semibold text-gray-550 dark:text-gray-400 flex items-center">
            <MapPin className="w-4 h-4 text-rose-500 mr-1 shrink-0" />
            {property.address}
          </p>
        </div>

        {/* Price Tag Box */}
        <div className="p-4 bg-navy-50 dark:bg-navy-900 border border-gold-250/30 rounded-2xl text-left lg:text-right shrink-0 h-fit">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest block mb-1">
            Offered Value / Price range
          </span>
          <span className="font-display font-black text-3xl sm:text-4xl text-navy-900 dark:text-gold-400">
            {property.priceFormatted}
          </span>
          <span className="text-[10px] text-gray-450 dark:text-gray-450 block italic mt-1 leading-none">
            Include society/allotment registry assistance
          </span>
        </div>
      </div>

      {/* 3. Main Grid of Gallery & details vs inquiry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT TWO COLUMNS: Image, specs, description, map */}
        <div className="col-span-1 lg:col-span-2 space-y-8 text-left">
          
          {/* A. Image gallery & control panel */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-150 border border-gray-100 dark:border-navy-900 shadow-md">
            <img
              src={property.images[activeImgIdx]}
              alt={`${property.name} - slide ${activeImgIdx + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all"
            />
            
            {/* Arrows controllers overlay */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2 z-10">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-11 py-1 text-center text-[10px] font-bold border rounded transition-all cursor-pointer ${
                    activeImgIdx === idx
                      ? 'bg-gold-500 border-gold-500 text-navy-950'
                      : 'bg-white/80 border-gray-200 text-gray-800'
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* B. Core Specifications row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/50 dark:bg-navy-900/50 border border-gray-150 dark:border-navy-900 p-5 rounded-2xl">
            <div className="p-3 bg-white dark:bg-navy-900 rounded-xl text-center space-y-1 block shadow-xs border border-gray-100 dark:border-navy-850">
              <Maximize className="w-5 h-5 text-gold-550 mx-auto" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none pt-1">Total Area</p>
              <p className="text-[13px] font-extrabold text-navy-900 dark:text-white font-mono leading-none">{property.area}</p>
            </div>

            <div className="p-3 bg-white dark:bg-navy-900 rounded-xl text-center space-y-1 block shadow-xs border border-gray-100 dark:border-navy-850">
              <BedDouble className="w-5 h-5 text-gold-550 mx-auto" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none pt-1">Bedrooms</p>
              <p className="text-[13px] font-extrabold text-navy-900 dark:text-white font-mono leading-none">
                {property.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-navy-900 rounded-xl text-center space-y-1 block shadow-xs border border-gray-100 dark:border-navy-850">
              <Bath className="w-5 h-5 text-gold-550 mx-auto" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none pt-1">Bathrooms</p>
              <p className="text-[13px] font-extrabold text-navy-900 dark:text-white font-mono leading-none">
                {property.bathrooms ? `${property.bathrooms} Baths` : 'N/A'}
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-navy-900 rounded-xl text-center space-y-1 block shadow-xs border border-gray-100 dark:border-navy-850">
              <Landmark className="w-5 h-5 text-gold-550 mx-auto" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none pt-1">Vastu Clear</p>
              <p className="text-[13px] font-extrabold text-emerald-500 leading-none font-mono">100% Vastu</p>
            </div>
          </div>

          {/* C. Description */}
          <div className="space-y-3.5">
            <h3 className="font-display font-black text-xl text-navy-900 dark:text-white border-b border-gray-100 dark:border-navy-900 pb-2 flex items-center gap-1.5">
              <span>Detailed Project Breakdown</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-450 animate-pulse"></span>
            </h3>
            <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed font-light">
              {property.description}
            </p>
          </div>

          {/* D. Premium Amenities check catalogs */}
          <div className="space-y-4">
            <h3 className="font-display font-black text-xl text-navy-900 dark:text-white border-b border-gray-100 dark:border-navy-900 pb-2">
              Elite Leisure &amp; Security Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {property.amenities.map((amenity, id) => (
                <div key={id} className="flex items-center gap-2.5 p-3.5 border border-gray-100 dark:border-navy-850 rounded-xl bg-gray-50/30 dark:bg-navy-900/30">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-500 shrink-0">
                    <svg className="w-4 h-4 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* E. Map Location section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-navy-900 pb-2">
              <h3 className="font-display font-black text-xl text-navy-900 dark:text-white">
                Locality Map Direction
              </h3>
              <p className="text-[11px] font-mono font-bold text-gold-650 tracking-wider">
                COORDINATES: {property.location}, LUCKNOW, UP
              </p>
            </div>
            
            <div className="w-full h-80 rounded-2xl overflow-hidden shadow-inner border border-gray-100 dark:border-navy-900 bg-gray-50 flex items-center justify-center relative">
              <iframe
                src={OFFICE_CONTACT.gmapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
                title={`${property.name} navigation map coordinates`}
              ></iframe>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR: Agent profile card and submission form */}
        <aside id="sidebar-inquiry-box" className="space-y-6">
          
          {/* Swastik Group Official Inquiry Desk */}
          <div className="bg-navy-950 text-white p-6 rounded-3xl border border-navy-850 shadow-lg text-left space-y-4">
            <div className="border-b border-navy-850 pb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold-400/15 border border-gold-400/30 text-[9px] font-bold font-mono text-gold-400 uppercase tracking-wider mb-2">
                Official Developer Counter
              </span>
              <h4 className="font-display font-extrabold text-lg text-white">
                 Swastik Group Desk
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed mt-1">
                Direct allotment inquiries, site visit arrangements, and authorized RERA verification documents.
              </p>
            </div>

            <div className="p-3.5 bg-navy-900 rounded-2xl border border-navy-850 space-y-1">
              <p className="text-[10px] font-mono tracking-widest text-gray-400 uppercase leading-none font-bold">Lucknow Desk Hotline</p>
              <a
                href="tel:+918953211182"
                className="font-display text-2xl font-black block text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-2"
              >
                <Phone className="w-5 h-5 text-gold-500 animate-bounce" />
                +91 89532 11182
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs font-bold">
              <button
                onClick={initWhatsApp}
                className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                title="Send inquiry on WhatsApp"
              >
                WhatsApp
              </button>
              <a
                href="tel:+918953211182"
                className="py-3 rounded-xl bg-gold-400 hover:bg-gold-500 text-navy-950 font-black flex items-center justify-center gap-1.5 transition-colors"
              >
                Call Now
              </a>
            </div>
          </div>

          {/* Inquiry Widget form */}
          <InquiryForm
            propertyId={property.id}
            propertyName={property.name}
            onSuccess={onToast}
          />

        </aside>

      </div>

      {/* 4. Similar listed properties */}
      <section id="similar-offerings" className="mt-20 pt-16 border-t border-gray-150 dark:border-navy-900 space-y-8">
        <div className="text-left space-y-2">
          <span className="font-mono text-xs font-bold text-gold-650 dark:text-gold-400 uppercase tracking-widest block">
            MORE FROM OUR SECTORS
          </span>
          <h3 className="font-display font-black text-2xl text-navy-900 dark:text-white">
            Similar Projects in same Category
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
            Explore these upscale RERA-approved recommendations located near strategic highway junctions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarShown.map((similar) => (
            <div 
              key={similar.id} 
              onClick={() => onViewSimilarDetails(similar.id)}
              className="cursor-pointer"
            >
              <PropertyCard
                property={similar}
                onViewDetails={onViewSimilarDetails}
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
