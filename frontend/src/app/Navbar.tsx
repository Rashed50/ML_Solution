"user client"
import React, { useState } from 'react';
// Using Lucide icons for the menu and dashboard items
import { Menu, X, Home, Users, Settings, ShoppingBag } from 'lucide-react';

// --- 1. Navbar Component (The fixed navigation) ---
const navItems = [
  { name: 'Dashboard', href: '#dashboard', Icon: Home }, // Changed icon to Icon for clarity
  { name: 'Team', href: '#team', Icon: Users },
  { name: 'Products', href: '#products', Icon: ShoppingBag },
  { name: 'Settings', href: '#settings', Icon: Settings },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand Section */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="text-2xl font-bold text-indigo-600 font-inter">
              A2R <span className="text-gray-900">Tech</span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 
                           hover:bg-indigo-50 hover:text-indigo-600 transition duration-150 ease-in-out"
              >
                {/* Rendering the component directly */}
                <item.Icon className="h-5 w-5 mr-1" />
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 
                         hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 
                         focus:ring-inset focus:ring-indigo-500 transition duration-150 ease-in-out"
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={toggleMenu}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 
                           hover:bg-indigo-50 hover:text-indigo-600 transition duration-150 ease-in-out w-full"
              >
                {/* Rendering the component directly */}
                <item.Icon className="h-6 w-6 mr-3" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};