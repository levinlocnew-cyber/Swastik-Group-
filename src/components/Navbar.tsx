import React, { useState } from 'react';
import { Menu, X, Phone, Search, Moon, Sun, Home, Building, Key, Info, Mail, Award } from 'lucide-react';
import { OFFICE_CONTACT } from '../data';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onSearchClick: () => void;
  setSearchQuery: (q: string) => void;
}

export default function Navbar({
  currentPage,
  setCurrentPage,
  isDarkMode,
  setIsDarkMode,
  onSearchClick,
  setSearchQuery
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'buy', label: 'Buy Property', icon: Building },
    { id: 'rent', label: 'Rent Property', icon: Key },
    { id: 'properties', label: 'All Properties', icon: Award },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact Us', icon: Mail }
  ];

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header id="site-header" className="sticky top-0 z-50 w-full border-b backdrop-blur-md bg-white/95 dark:bg-navy-950/95 border-gray-100 dark:border-navy-900 shadow-xs transition-colors duration-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('home')} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-navy-800 to-navy-650 dark:from-gold-600 dark:to-gold-400 text-gold-400 dark:text-navy-950 shadow-md group-hover:scale-105 transition-all">
              <span className="font-display font-extrabold text-xl">S</span>
              <span className="font-display font-bold text-xs -ml-0.5">G</span>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl tracking-tight leading-none text-navy-900 dark:text-white flex items-center gap-1.5">
                SWASTIK <span className="text-gold-500 font-medium text-lg">GROUP</span>
              </h1>
              <p className="font-mono text-[9px] tracking-widest text-gray-400 uppercase leading-none mt-1">
                Luxury Lucknow Living
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-menu" className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || 
                (item.id === 'buy' && currentPage === 'buy-listings') ||
                (item.id === 'rent' && currentPage === 'rent-listings');
              
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-gold-600 bg-gold-50/50 dark:text-gold-400 dark:bg-gold-950/20'
                      : 'text-gray-650 dark:text-gray-300 hover:text-gold-500 dark:hover:text-gold-450 hover:bg-gray-50 dark:hover:bg-navy-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-70" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Utilities */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Quick Filter Search Trigger button */}
            <button
              id="search-trigger-btn"
              onClick={onSearchClick}
              className="p-2.5 rounded-xl text-gray-550 dark:text-gray-350 hover:text-navy-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-900/60 transition-all cursor-pointer"
              title="Search Location or Property Type"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode switcher */}
            <button
              id="theme-toggler"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl text-gray-550 dark:text-gray-350 hover:text-navy-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-900/60 transition-all cursor-pointer"
              aria-label="Toggle Dark Mode Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Call Now Premium CTA */}
            <a
              id="nav-call-btn"
              href={`tel:${OFFICE_CONTACT.phone}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white dark:text-navy-950 bg-navy-800 dark:bg-gold-500 hover:bg-navy-900 dark:hover:bg-gold-400 hover:-translate-y-0.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>

          {/* Mobile Right Icons (Phone / Theme Toggle / Hamburger) */}
          <div className="flex lg:hidden items-center space-x-1.5">
            <button
              id="search-trigger-mobile"
              onClick={onSearchClick}
              className="p-2 text-gray-550 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-900 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              id="theme-toggle-mobile"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-550 dark:text-gray-350 hover:bg-gray-100 dark:hover:bg-navy-900 rounded-lg"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              id="mobile-menu-trigger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-navy-900 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-900 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div id="mobile-drawer" className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-navy-950 border-b border-gray-100 dark:border-navy-900 py-4 px-6 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-250">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || 
                (item.id === 'buy' && currentPage === 'buy-listings') ||
                (item.id === 'rent' && currentPage === 'rent-listings');
              
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-semibold flex items-center gap-3 transition-all ${
                    isActive
                      ? 'text-gold-600 bg-gold-50 dark:text-gold-450 dark:bg-gold-950/25'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gold-600 hover:bg-gray-50 dark:hover:bg-navy-900/30'
                  }`}
                >
                  <Icon className="w-5 h-5 text-gold-550" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-navy-900 space-y-4">
            <div className="text-center">
              <p className="text-xs text-gray-450 dark:text-gray-450 uppercase tracking-widest font-mono">
                Assistance Line
              </p>
              <a 
                href={`tel:${OFFICE_CONTACT.phone}`} 
                className="mt-1 inline-flex items-center gap-2 text-lg font-bold text-navy-800 dark:text-gold-400 hover:underline"
              >
                <Phone className="w-4 h-4" />
                {OFFICE_CONTACT.phone}
              </a>
            </div>

            <a
              id="mobile-nav-cta"
              href={`tel:${OFFICE_CONTACT.phone}`}
              className="w-full text-center block py-3.5 bg-gradient-to-r from-navy-800 to-navy-750 dark:from-gold-600 dark:to-gold-500 text-white dark:text-navy-950 font-bold rounded-xl shadow-lg"
            >
              Contact Agent Instantly
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
