import React, { useState, useEffect } from 'react';
import { Search, MapPin, Grid, List, SlidersHorizontal, ArrowUpDown, RefreshCw, X, HelpCircle, Sparkles } from 'lucide-react';
import { Property, PropertyCategory, PropertyType } from '../types';
import { PROPERTIES_DATA, LUCKNOW_LOCALITIES } from '../data';
import PropertyCard from '../components/PropertyCard';

interface PropertiesViewProps {
  onViewDetails: (id: string) => void;
  initialFilters?: {
    category: string;
    type: string;
    location: string;
    keyword: string;
  };
  forceType?: PropertyType; // 'buy' or 'rent' constraints
}

export default function PropertiesView({ onViewDetails, initialFilters, forceType }: PropertiesViewProps) {
  // Local filter states initialized with any optional global search presets
  const [filterType, setFilterType] = useState<string>(forceType || initialFilters?.type || '');
  const [filterCategory, setFilterCategory] = useState<string>(initialFilters?.category || '');
  const [filterLocality, setFilterLocality] = useState<string>(initialFilters?.location || '');
  const [filterBedrooms, setFilterBedrooms] = useState<string>('');
  const [filterMaxBudget, setFilterMaxBudget] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>(initialFilters?.keyword || '');

  // Grid/List toggle layout state
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // Sorting state
  const [sortOption, setSortOption] = useState<string>('featured');

  // simulated loading skeleton state
  const [isLoading, setIsLoading] = useState(false);

  // Sync state if forceType changes (e.g., clicking Buy Property vs Rent Property in Nav)
  useEffect(() => {
    if (forceType) {
      setFilterType(forceType);
    }
  }, [forceType]);

  // Sync global header search changes if they arrive
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.type) setFilterType(initialFilters.type);
      if (initialFilters.category) setFilterCategory(initialFilters.category);
      if (initialFilters.location) setFilterLocality(initialFilters.location);
      if (initialFilters.keyword) setSearchKeyword(initialFilters.keyword);
    }
  }, [initialFilters]);

  // Simulate skeleton loaders upon filter update
  const triggerFilterRefreshes = () => {
    setIsLoading(true);
    const order = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(order);
  };

  const handleResetFilters = () => {
    setFilterType(forceType || '');
    setFilterCategory('');
    setFilterLocality('');
    setFilterBedrooms('');
    setFilterMaxBudget(0);
    setSearchKeyword('');
    setSortOption('featured');
    triggerFilterRefreshes();
  };

  // Main filter matching equation
  const filteredProperties = PROPERTIES_DATA.filter((p) => {
    // Constraint 1: Force Type (Buy/Rent limit)
    if (forceType && p.type !== forceType) return false;
    
    // Constraint 2: General Buy/Rent Filter
    if (filterType && p.type !== filterType) return false;

    // Constraint 3: Category Filter
    if (filterCategory && p.category !== filterCategory) return false;

    // Constraint 4: Locality Filter
    if (filterLocality && p.location !== filterLocality) return false;

    // Constraint 5: Bedrooms Filter
    if (filterBedrooms) {
      const bedsNum = parseInt(filterBedrooms);
      if (bedsNum === 4 && (!p.bedrooms || p.bedrooms < 4)) return false;
      if (bedsNum !== 4 && p.bedrooms !== bedsNum) return false;
    }

    // Constraint 6: Max Budget (INR raw scale)
    if (filterMaxBudget > 0 && p.price > filterMaxBudget) return false;

    // Constraint 7: Keyword Text Search Match
    if (searchKeyword.trim()) {
      const queryStr = searchKeyword.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(queryStr);
      const addressMatch = p.address.toLowerCase().includes(queryStr);
      const amenitiesMatch = p.amenities.some(a => a.toLowerCase().includes(queryStr));
      const categoryMatch = p.category.toLowerCase().includes(queryStr);
      const locMatch = p.location.toLowerCase().includes(queryStr);
      if (!nameMatch && !addressMatch && !amenitiesMatch && !categoryMatch && !locMatch) return false;
    }

    return true;
  });

  // Sorting routine
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortOption === 'price-low') {
      return a.price - b.price;
    } else if (sortOption === 'price-high') {
      return b.price - a.price;
    } else if (sortOption === 'area-large') {
      const getSqFt = (areaStr: string) => parseInt(areaStr.replace(/[^0-9]/g, '')) || 0;
      return getSqFt(b.area) - getSqFt(a.area);
    } else {
      // default: Featured or RERA status
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  // Formatted maximum budget values dictionary
  const budgetGuides = [
    { label: 'Any Budget', value: 0 },
    { label: 'Under ₹50 Lakhs', value: 5000000 },
    { label: 'Under ₹1 Crore', value: 10000000 },
    { label: 'Under ₹2 Crores', value: 20000000 },
    { label: 'Under ₹3 Crores', value: 30000000 },
    { label: 'Under ₹5 Crores', value: 50000000 }
  ];

  return (
    <div id="properties-view-rig" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans dark:bg-navy-950 min-h-[90vh]">
      
      {/* Title Header area */}
      <div className="border-b border-gray-100 dark:border-navy-900 pb-6 mb-8 text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-100 dark:bg-navy-900 text-navy-800 dark:text-gold-450 text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          UP-RERA CERTIFIED CATALOG
        </div>
        <h2 className="font-display font-extrabold text-3xl text-navy-900 dark:text-white">
          {forceType === 'buy' ? 'Premium Properties for Sale in Lucknow' :
           forceType === 'rent' ? 'Curated Properties for Rent/Lease' :
           'Exquisite Real Estate Collection'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-light max-w-2xl">
          Browse verified villas, flats, and plots. Refine your results by choosing budgets, locality coordinates, and bedroom requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* FILTERS PANEL CODES */}
        <aside id="sidebar-filters" className="lg:col-span-1 space-y-6 bg-white dark:bg-navy-900 p-5 rounded-2xl border border-gray-100 dark:border-navy-900 shadow-xs h-fit self-start">
          
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-navy-850 pb-3">
            <h3 className="font-display font-extrabold text-base text-navy-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold-550" />
              Refine Search
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer flex items-center gap-1"
              id="reset-filter-link"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-4 text-left">
            
            {/* keyword search */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-mono">
                Keyword Matching
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    triggerFilterRefreshes();
                  }}
                  placeholder="e.g. villa, pool, modern"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-navy-950 text-xs font-semibold border border-gray-200 dark:border-navy-850 rounded-xl outline-none focus:border-gold-500 dark:text-white"
                />
              </div>
            </div>

            {/* Listing Type: buy or rent (only shown if not forced for specific page) */}
            {!forceType && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-mono">
                  Deal Type
                </label>
                <div className="grid grid-cols-3 gap-1 bg-gray-50 dark:bg-navy-950 p-1 rounded-xl border border-gray-150 dark:border-navy-850">
                  {['', 'buy', 'rent'].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setFilterType(t);
                        triggerFilterRefreshes();
                      }}
                      className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        filterType === t
                          ? 'bg-navy-800 text-white dark:bg-gold-500 dark:text-navy-950 shadow-xs'
                          : 'text-gray-500 hover:text-navy-900 dark:hover:text-white'
                      }`}
                    >
                      {t === '' ? 'All' : t === 'buy' ? 'Buy' : 'Rent'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Property category selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-mono">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  triggerFilterRefreshes();
                }}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 text-xs font-semibold border border-gray-200 dark:border-navy-850 rounded-xl outline-none focus:border-gold-500 dark:text-white text-gray-700"
              >
                <option value="">All Categories</option>
                <option value="villa">Elite Villas</option>
                <option value="apartment">Luxury Apartments</option>
                <option value="plot">Gated Township Plots</option>
                <option value="commercial">Commercial Hubs</option>
              </select>
            </div>

            {/* Select Locality */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-mono">
                Lucknow Locality
              </label>
              <select
                value={filterLocality}
                onChange={(e) => {
                  setFilterLocality(e.target.value);
                  triggerFilterRefreshes();
                }}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 text-xs font-semibold border border-gray-200 dark:border-navy-850 rounded-xl outline-none focus:border-gold-500 dark:text-white text-gray-700"
              >
                <option value="">All Locations</option>
                {LUCKNOW_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Maximum Budget Limits */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-mono">
                Max Budget Limit
              </label>
              <select
                value={filterMaxBudget}
                onChange={(e) => {
                  setFilterMaxBudget(Number(e.target.value));
                  triggerFilterRefreshes();
                }}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 text-xs font-semibold border border-gray-200 dark:border-navy-850 rounded-xl outline-none focus:border-gold-500 dark:text-white text-gray-700"
              >
                {budgetGuides.map((item, id) => (
                  <option key={id} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* BedRooms Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-mono">
                Beds Configuration
              </label>
              <select
                value={filterBedrooms}
                onChange={(e) => {
                  setFilterBedrooms(e.target.value);
                  triggerFilterRefreshes();
                }}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 text-xs font-semibold border border-gray-200 dark:border-navy-850 rounded-xl outline-none focus:border-gold-500 dark:text-white text-gray-700"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>

          </div>

          {/* Quick Stats Indicator inside sidebar */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-navy-850 text-center">
            <span className="text-[11px] font-mono text-gray-500">
              Showing <strong className="text-gold-650 dark:text-gold-400">{sortedProperties.length}</strong> matches
            </span>
          </div>

        </aside>

        {/* PROPERTY LISTING GRID */}
        <section id="results-shelf" className="lg:col-span-3 space-y-6">
          
          {/* Top Sort and layout toolbar */}
          <div className="bg-white dark:bg-navy-900 border border-gray-150 dark:border-navy-900 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="text-xs font-semibold text-gray-500">
              Found {sortedProperties.length} elite properties listed in Lucknow
            </div>

            {/* Utilities controls */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-navy-950 p-1 rounded-lg border border-gray-150 dark:border-navy-850">
                <button
                  onClick={() => setViewLayout('grid')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewLayout === 'grid'
                      ? 'bg-white dark:bg-navy-900 text-gold-500 shadow-xs'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="Grid Layout"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewLayout('list')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewLayout === 'list'
                      ? 'bg-white dark:bg-navy-900 text-gold-500 shadow-xs'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="List Layout"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sorting Choices */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    triggerFilterRefreshes();
                  }}
                  className="pl-8 pr-3 py-2 bg-gray-50 dark:bg-navy-950 text-xs font-bold border border-gray-150 dark:border-navy-850 rounded-xl outline-none focus:border-gold-500 dark:text-white text-gray-700 cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="area-large">Area: Large First</option>
                </select>
                <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-550 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* SKELETON LOADERS SIMULATION */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-850 rounded-2xl overflow-hidden h-[420px] p-4 flex flex-col justify-between">
                  <div className="w-full aspect-video bg-gray-100 dark:bg-navy-800 rounded-xl mb-4"></div>
                  <div className="space-y-3 flex-1">
                    <div className="w-1/3 h-4 bg-gray-100 dark:bg-navy-800 rounded"></div>
                    <div className="w-3/4 h-6 bg-gray-100 dark:bg-navy-800 rounded"></div>
                    <div className="w-full h-4 bg-gray-50 dark:bg-navy-800 rounded"></div>
                  </div>
                  <div className="h-10 bg-gray-150 dark:bg-navy-800 w-full rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : sortedProperties.length > 0 ? (
            /* PROPERTIES RESULTS CONTAINER */
            <div className={
              viewLayout === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "flex flex-col space-y-6"
            }>
              {sortedProperties.map((property) => {
                if (viewLayout === 'list') {
                  // Custom premium inline List render
                  return (
                    <article
                      key={property.id}
                      onClick={() => onViewDetails(property.id)}
                      className="bg-white dark:bg-navy-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-navy-850 p-4 flex flex-col md:flex-row gap-5 hover:shadow-xl transition-all scale-on-hover cursor-pointer text-left group"
                    >
                      <div className="relative w-full md:w-56 aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={property.images[0]}
                          alt={property.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white bg-navy-800/80 rounded">
                          {property.status}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="space-y-1.5 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest font-mono">
                              {property.category}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                            <span className="text-xs text-gray-500 font-medium">
                              {property.location}
                            </span>
                          </div>

                          <h3 className="font-display font-extrabold text-lg text-navy-900 dark:text-white group-hover:text-gold-600 transition-colors">
                            {property.name}
                          </h3>

                          <p className="text-xs text-gray-400 line-clamp-1">
                            {property.address}
                          </p>

                          {/* Quick specs short tag */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {[`SqFt: ${property.area}`, property.bedrooms ? `${property.bedrooms} Bed` : '', property.bathrooms ? `${property.bathrooms} Bath` : ''].filter(Boolean).map((tag, i) => (
                              <span key={i} className="text-[10px] font-bold text-gray-500 bg-gray-50 dark:bg-navy-950 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 md:mt-2 border-t border-gray-100 dark:border-navy-850 pt-3">
                          <span className="font-display font-black text-xl text-navy-900 dark:text-gold-400">
                            {property.priceFormatted}
                          </span>
                          <span className="text-xs font-bold text-gold-550 flex items-center gap-1">
                            View Details
                            <X className="w-3.5 h-3.5 rotate-45 stroke-[2.5]" />
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                }

                // Default Grid Card
                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onViewDetails={onViewDetails}
                  />
                );
              })}
            </div>
          ) : (
            /* EMPTY SHELF STATE */
            <div className="bg-white dark:bg-navy-900 border border-gold-200/50 dark:border-navy-850/60 p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center text-gold-500 mx-auto">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="font-display font-black text-xl text-navy-900 dark:text-white">
                No Properties Match Your Selection
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                No active real estate listings are matches for maximum budget ₹{(filterMaxBudget / 10000000).toFixed(2)} Cr in {filterLocality || 'Lucknow'}.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-navy-800 text-white font-bold text-xs hover:bg-gold-500 hover:text-navy-950 transition-all cursor-pointer shadow-md"
              >
                Clear Search & View All Listings
              </button>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}
