import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, ShieldCheck, Banknote, Landmark, ArrowRight, Star, Quote, Compass, Calendar, Sparkles } from 'lucide-react';
import { Property, PropertyCategory, PropertyType } from '../types';
import { TESTIMONIALS_DATA, LUCKNOW_LOCALITIES } from '../data';
import { api } from '../utils/api';
import PropertyCard from '../components/PropertyCard';

interface HomeViewProps {
  setCurrentPage: (page: string) => void;
  onViewDetails: (id: string) => void;
  setGlobalFilters: (filters: {
    category: string;
    type: string;
    location: string;
    keyword: string;
  }) => void;
}

export default function HomeView({ setCurrentPage, onViewDetails, setGlobalFilters }: HomeViewProps) {
  // Local states for Hero search bar
  const [activeTab, setActiveTab] = useState<PropertyType>('buy');
  const [searchLocality, setSearchLocality] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Active testimonial slider
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalFilters({
      type: activeTab,
      category: searchCategory,
      location: searchLocality,
      keyword: searchQuery
    });
    setCurrentPage('properties');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCategoryCardClick = (cat: PropertyCategory) => {
    setGlobalFilters({
      type: '',
      category: cat,
      location: '',
      keyword: ''
    });
    setCurrentPage('properties');
  };

  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    api.properties.list()
      .then((data) => {
        setProperties(data || []);
      })
      .catch((err) => {
        console.warn('Fail loading homepage listings from api:', err);
      });
  }, []);

  const featuredProperties = properties.filter(p => p.featured);

  // Statistics counters
  const stats = [
    { value: '150+', label: 'Delivered Villa Units' },
    { value: '450+', label: 'Happy Lucknow Familes' },
    { value: '₹500Cr+', label: 'Transactions facilitated' },
    { value: '100%', label: 'RERA Clear titles' }
  ];

  return (
    <div id="home-view-wrapper" className="font-sans dark:bg-navy-950 transition-colors">
      
      {/* 1. Hero Section */}
      <section id="hero-showcase" className="relative min-h-[calc(100vh-80px)] lg:h-[88vh] flex items-center justify-center overflow-hidden bg-navy-950 pt-8 pb-14 lg:py-0">
        {/* Background Image with optimized dark overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000"
            alt="Lucknow luxury villa skyline"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-8">
          
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-350">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-widest leading-none">
              <Sparkles className="w-3.5 h-3.5" />
              Lucknow&apos;s Leading Luxury Real Estate Group
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight max-w-4xl mx-auto">
              Find Your <span className="text-gold-400">Dream Property</span> in Lucknow
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Explore RERA-approved luxurious villas, sky apartments, plots, and premium corporate offices in Vibhuti Khand, Hazratganj, and Shaheed Path.
            </p>
          </div>

          {/* Luxury Search Engine */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-navy-900 p-4 sm:p-5 rounded-3xl shadow-2xl border border-gray-100/50 dark:border-navy-850 text-gray-900 animate-in fade-in slide-in-from-bottom duration-400 delay-150">
            
            {/* Tab selection */}
            <div className="flex gap-2 mb-4 border-b border-gray-100 dark:border-navy-855 pb-3">
              {[
                { label: 'Buy Properties', id: 'buy' },
                { label: 'Rent Properties', id: 'rent' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`hero-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as PropertyType)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-navy-800 text-white dark:bg-gold-500 dark:text-navy-950 shadow-md'
                      : 'text-gray-500 hover:text-navy-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-transparent text-left items-end">
              
              {/* Select Locality */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 block">
                  Select Locality
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                  <select
                    value={searchLocality}
                    onChange={(e) => setSearchLocality(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-navy-950 text-xs font-semibold border border-gray-200 dark:border-navy-800 rounded-xl outline-none focus:border-gold-500 dark:text-white text-gray-800"
                  >
                    <option value="">All Locations</option>
                    {LUCKNOW_LOCALITIES.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Select Property Type / Category */}
              <div className="space-y-1 w-full">
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 block">
                  Property Category
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-navy-950 text-xs font-semibold border border-gray-200 dark:border-navy-800 rounded-xl outline-none focus:border-gold-500 dark:text-white text-gray-800"
                  >
                    <option value="">All Categories</option>
                    <option value="apartment">Luxury Apartment</option>
                    <option value="villa">Elite Villa</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="plot">Township Plot</option>
                  </select>
                </div>
              </div>

              {/* keyword Match */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 block">
                  Search Keyword
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. ready, penthouse, park"
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-navy-950 text-xs font-semibold border border-gray-200 dark:border-navy-800 rounded-xl outline-none focus:border-gold-500 dark:text-white text-gray-800"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-navy-800 hover:bg-gold-500 text-white hover:text-navy-950 dark:bg-gold-500 dark:hover:bg-gold-450 dark:text-navy-950 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer duration-200"
              >
                <Search className="w-4 h-4 shrink-0" />
                Find Properties
              </button>

            </form>
          </div>

          {/* Quick CTA switches */}
          <div className="flex flex-wrap justify-center gap-4 pt-4 text-sm font-semibold text-gray-300 animate-in fade-in duration-500 delay-300">
            <span>Popular Localities:</span>
            {['Gomti Nagar', 'Hazratganj', 'Shaheed Path'].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setGlobalFilters({ type: '', category: '', location: item, keyword: '' });
                  setCurrentPage('properties');
                }}
                className="text-gold-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                {item} <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 2. Brand Value Proposition: Why Choose Us */}
      <section id="features-proposition" className="py-20 bg-gray-50 dark:bg-navy-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="max-w-3xl mx-auto space-y-3">
            <span className="font-mono text-xs font-bold text-gold-650 dark:text-gold-400 uppercase tracking-widest">
              LUCKNOW REALTY BENCHMARKS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-900 dark:text-white">
              Why Homeowners Trust Swastik Group
            </h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full"></div>
            <p className="text-sm text-gray-505 dark:text-gray-400 leading-relaxed font-light">
              Built on decades of local execution, we deliver maximum compliance, verified title deeds, premium building structures, and dedicated relationship specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'RERA Compliant Listing',
                desc: 'All our primary projects are 100% compliant with UP-RERA guidelines, protecting your hard-earned investments with secure construction timelines.'
              },
              {
                icon: Landmark,
                title: 'Clear Titles & Registry',
                desc: 'Our legal desk performs painstaking historical scrutiny to safeguard zero property dispute headaches and handle registry procedures smoothly.'
              },
              {
                icon: Banknote,
                title: 'Top Bank Approvals',
                desc: 'Enjoy rapid mortgage support and pocket-friendly loan offers with Swastik Group being pre-certified by SBI, HDFC, ICICI, and LIC Housing.'
              },
              {
                icon: Compass,
                title: 'Vastu Compliant Design',
                desc: 'Our villas and apartments focus heavily on cardinal ventilation, cosmic alignments, and traditional layouts for peaceful positive living.'
              }
            ].map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <div key={idx} className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-900 p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow text-left space-y-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="font-display font-extrabold text-base text-navy-900 dark:text-white leading-tight">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
                    {prop.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. Featured Properties Carousel */}
      <section id="featured-listings" className="py-20 bg-white dark:bg-navy-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3 text-left">
              <span className="font-mono text-xs font-bold text-gold-650 dark:text-gold-400 uppercase tracking-widest">
                EXCLUSIVE COLLECTION
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-900 dark:text-white">
                Featured Properties in Lucknow
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl font-light">
                Our most premium residential layouts and multi-crore investment avenues situated in Vibhuti Khand and high-end Hazratganj streets.
              </p>
            </div>
            
            <button
              onClick={() => {
                setGlobalFilters({ type: '', category: '', location: '', keyword: '' });
                setCurrentPage('properties');
              }}
              className="inline-flex items-center gap-1 px-5 py-3 text-xs font-bold text-white bg-navy-800 hover:bg-gold-550 hover:text-navy-950 dark:bg-gold-500 dark:hover:bg-gold-400 dark:text-navy-950 rounded-xl shadow-md transition-all self-start cursor-pointer font-display"
            >
              Browse All Properties
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.slice(0, 3).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 4. Luxury Property Categories */}
      <section id="property-categories-grid" className="py-20 bg-gray-50 dark:bg-navy-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="max-w-3xl mx-auto space-y-3">
            <span className="font-mono text-xs font-bold text-gold-650 dark:text-gold-400 uppercase tracking-widest font-mono">
              CURATED SECTORS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-900 dark:text-white">
              Explore Property Types
            </h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Elite Villas',
                cat: 'villa',
                count: '15+ Units Available',
                image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=400'
              },
              {
                title: 'Sky Apartments',
                cat: 'apartment',
                count: '34+ Units Available',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400'
              },
              {
                title: 'Township Plots',
                cat: 'plot',
                count: '48+ Units Available',
                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400'
              },
              {
                title: 'Corporate Offices',
                cat: 'commercial',
                count: '12+ Units Available',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'
              }
            ].map((col, idx) => (
              <div
                key={idx}
                id={`cat-card-${col.cat}`}
                onClick={() => handleCategoryCardClick(col.cat as PropertyCategory)}
                className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all text-left"
              >
                <div className="absolute inset-0">
                  <img
                    src={col.image}
                    alt={col.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Premium overlay shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-black/10"></div>
                </div>

                <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between text-white">
                  <div>
                    <h3 className="font-display font-black text-xl leading-none">
                      {col.title}
                    </h3>
                    <p className="text-xs text-gold-400 font-medium mt-1.5 leading-none">
                      {col.count}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-gold-500 group-hover:text-navy-950 flex items-center justify-center text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Statistics Counters */}
      <section id="statistics-counter-bar" className="py-16 bg-navy-900 border-y border-navy-850 text-white transition-colors duration-250">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <p className="font-display font-black text-3xl sm:text-4xl text-gold-450 leading-none">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-gray-400 font-mono">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Slider */}
      <section id="customer-testimonials" className="py-20 bg-white dark:bg-navy-950 transition-colors">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-12">
          
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-gold-650 dark:text-gold-400 uppercase tracking-widest">
              LUCKNOW HOMEOWNERS STORIES
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-900 dark:text-white">
              Endorsed By Respected Citizens
            </h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          {/* Testimonial Active Slider block */}
          <div className="bg-gray-50 dark:bg-navy-900 border border-gray-100 dark:border-navy-850 p-6 sm:p-10 rounded-3xl relative shadow-md">
            <Quote className="absolute top-6 left-6 text-gold-300 dark:text-navy-800 w-12 h-12 opacity-35 stroke-[1]" />
            
            <div className="space-y-6">
              {/* Stars */}
              <div className="flex justify-center space-x-1.5 text-gold-500">
                {Array.from({ length: TESTIMONIALS_DATA[activeTestimonialIdx].rating }).map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed italic max-w-3xl mx-auto font-medium">
                &ldquo;{TESTIMONIALS_DATA[activeTestimonialIdx].review}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col items-center justify-center space-y-2 pt-4 border-t border-gray-100 dark:border-navy-800">
                <img
                  src={TESTIMONIALS_DATA[activeTestimonialIdx].image}
                  alt={TESTIMONIALS_DATA[activeTestimonialIdx].name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gold-400"
                />
                <div>
                  <p className="font-bold text-sm text-navy-900 dark:text-white leading-none">
                    {TESTIMONIALS_DATA[activeTestimonialIdx].name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 leading-none font-medium">
                    {TESTIMONIALS_DATA[activeTestimonialIdx].role} • {TESTIMONIALS_DATA[activeTestimonialIdx].date}
                  </p>
                </div>
              </div>
            </div>

            {/* Slider Dots indicators */}
            <div className="flex items-center justify-center space-x-2 mt-8">
              {TESTIMONIALS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonialIdx(idx)}
                  className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                    activeTestimonialIdx === idx
                      ? 'bg-gold-500 scale-125'
                      : 'bg-gray-300 dark:bg-navy-800 hover:bg-gold-300'
                  }`}
                  aria-label={`Show testimonial slide ${idx + 1}`}
                ></button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 7. Call To Action (Banner) */}
      <section id="cta-conversion-stripe" className="relative py-16 bg-navy-900 text-white overflow-hidden text-center sm:text-left">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200"
            alt="Swastik real estate background theme"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
              Planning to Sell or Lease Your Luxury House?
            </h3>
            <p className="text-sm text-gray-300 max-w-xl font-light">
              Connect with Lucknow&apos;s leading property advisors. Get premium buyer exposure, verified real price evaluations, and stress-free registries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentPage('contact')}
              className="px-6 py-3.5 bg-gold-500 hover:bg-gold-450 text-navy-950 font-bold rounded-xl shadow-md transition-all cursor-pointer text-sm"
            >
              List Your Property
            </button>
            <button
              onClick={() => {
                setGlobalFilters({ type: 'rent', category: '', location: '', keyword: '' });
                setCurrentPage('properties');
              }}
              className="px-6 py-3.5 bg-navy-800 hover:bg-navy-750 text-white rounded-xl border border-navy-750 transition-all cursor-pointer text-sm"
            >
              Search Rental Properties
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
