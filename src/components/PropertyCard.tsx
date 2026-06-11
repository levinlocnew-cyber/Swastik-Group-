import React, { useState, useEffect } from 'react';
import { MapPin, BedDouble, Bath, Maximize, Heart, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  key?: string;
  property: Property;
  onViewDetails: (id: string) => void;
}

export default function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('swastik_saved_properties');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        setIsBookmarked(ids.includes(property.id));
      }
    } catch (e) {
      console.warn('LocalStorage error loading saved properties');
    }
  }, [property.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('swastik_saved_properties');
      let ids: string[] = saved ? JSON.parse(saved) : [];
      
      if (ids.includes(property.id)) {
        ids = ids.filter(id => id !== property.id);
        setIsBookmarked(false);
      } else {
        ids.push(property.id);
        setIsBookmarked(true);
      }
      localStorage.setItem('swastik_saved_properties', JSON.stringify(ids));
      // Dispatch a storage event so other components update counts
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error modifying bookmarked properties list');
    }
  };

  // Convert category strings to beautiful human readable badges
  const categoryLabels: Record<string, string> = {
    residential: 'Residential',
    commercial: 'Commercial Project',
    apartment: 'Luxury Apartment',
    villa: 'Elite Villa',
    plot: 'Premium Plot'
  };

  const isRent = property.type === 'rent';

  return (
    <article 
      className="bg-white dark:bg-navy-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-navy-850/60 shadow-xs hover:shadow-xl transition-all duration-350 scale-on-hover flex flex-col h-full group"
      id={`property-card-${property.id}`}
    >
      {/* Property Image & Overlays */}
      <div className="relative w-full aspect-video md:aspect-[4/3] lg:aspect-video overflow-hidden bg-gray-100">
        <img
          src={property.images[0]}
          alt={property.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 ease-out"
        />
        
        {/* Dark subtle shade backdrop for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10"></div>

        {/* Status indicator badge (Buy vs Rent) */}
        <div className="absolute top-4 left-4 flex gap-1.5 z-10">
          <span className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-navy-800/90 backdrop-blur-xs rounded-md shadow-xs">
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
          <span className={`px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-950 rounded-md shadow-xs ${
            property.status === 'Ready to Move' ? 'bg-emerald-400' :
            property.status === 'Under Construction' ? 'bg-amber-400' :
            property.status === 'Newly Launched' ? 'bg-sky-400' : 'bg-gold-300'
          }`}>
            {property.status}
          </span>
        </div>

        {/* Save to Favourites Heart overlay */}
        <button
          onClick={toggleBookmark}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
            isBookmarked 
              ? 'bg-rose-500/95 text-white scale-110 shadow-md' 
              : 'bg-white/80 hover:bg-white text-gray-700 hover:text-rose-500 hover:scale-105 shadow-xs'
          }`}
          title={isBookmarked ? "Remove from Saved Properties" : "Save Property"}
          aria-label="Bookmark icon button"
        >
          <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag Overlay at the bottom-left of image */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="font-display font-black text-2xl tracking-tight text-white drop-shadow-md bg-navy-950/70 py-1 px-3.5 rounded-lg border border-gold-500/20">
            {property.priceFormatted}
          </span>
        </div>

        {/* RERA compliance overlay */}
        {property.reraApproved && (
          <div className="absolute bottom-4 right-4 bg-emerald-950/70 px-2 py-1 rounded border border-emerald-400/30 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">UP-RERA</span>
          </div>
        )}
      </div>

      {/* Property Details Block */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Locality & Category */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-650 dark:text-gold-400 uppercase tracking-widest font-mono">
              {categoryLabels[property.category]}
            </span>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-500 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(property.id)} 
            className="font-display font-extrabold text-lg text-navy-900 dark:text-white line-clamp-1 group-hover:text-gold-600 dark:group-hover:text-gold-450 cursor-pointer transition-colors leading-snug"
          >
            {property.name}
          </h3>

          {/* Slashed address */}
          <p className="text-xs text-gray-500 dark:text-gray-450 line-clamp-2 leading-relaxed">
            {property.address}
          </p>
        </div>

        {/* Feature Icons row */}
        <div className="grid grid-cols-3 gap-2.5 py-4 my-4 border-y border-gray-100 dark:border-navy-850 text-center text-xs font-medium text-gray-650 dark:text-gray-300">
          <div className="flex flex-col items-center justify-center p-1 bg-gray-50/50 dark:bg-navy-950/30 rounded-lg">
            <Maximize className="w-4 h-4 text-gray-450 mb-1" />
            <span className="font-mono text-[10px] text-gray-500 leading-none">{property.area}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-1 bg-gray-50/50 dark:bg-navy-950/30 rounded-lg">
            <BedDouble className="w-4 h-4 text-gray-450 mb-1" />
            <span className="font-mono text-[10px] text-gray-500 leading-none">
              {property.bedrooms ? `${property.bedrooms} Beds` : 'N/A'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-1 bg-gray-50/50 dark:bg-navy-950/30 rounded-lg">
            <Bath className="w-4 h-4 text-gray-450 mb-1" />
            <span className="font-mono text-[10px] text-gray-500 leading-none">
              {property.bathrooms ? `${property.bathrooms} Baths` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Bottom CTA & Swastik Verified */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gold-400 select-none flex items-center justify-center text-navy-950 font-display font-black text-xs ring-2 ring-gold-200 dark:ring-gold-800">
              SG
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-navy-850 dark:text-white leading-none">
                Swastik Group
              </p>
              <p className="text-[9px] text-emerald-500 leading-none mt-1 font-semibold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Official Member
              </p>
            </div>
          </div>

          <button
            onClick={() => onViewDetails(property.id)}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-navy-800 hover:bg-gold-550 hover:text-navy-950 rounded-xl transition-all cursor-pointer shadow-xs font-display"
          >
            Details
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
}
