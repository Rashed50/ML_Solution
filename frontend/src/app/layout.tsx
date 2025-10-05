"use client";
import "./globals.css";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileOpen) {
        setMobileOpen(false);
        setOpenSubMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileOpen]);

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenSubMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenSubMenu(null);
    }, 300); // 300ms delay
  };

  const menuItems = [
    {
      name: "PDF Tools",
      items: [
        { name: "PDF to Text", href: "/services/pdf/to-text" },
        { name: "PDF to Image", href: "/services/pdf/to-image" },
        { name: "Images to PDF", href: "/services/pdf/images-to-pdf" },
      ],
    },
    {
      name: "Image Tools",
      items: [
        { name: "Transformation", href: "/ml/images" },
        { name: "Edge Detection", href: "/ml/edge" },
        { name: "Invoice", href: "/invoice" },
      ],
    },
    {
      name: "Word Tools",
      items: [
        { name: "Word to PDF", href: "/services/word/to-pdf" },
      ],
    },
  ];

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">IMAGE PROCESSING</h1>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {menuItems.map((menu) => (
                  <div
                    key={menu.name}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(menu.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <span className="font-medium">{menu.name}</span>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${
                          openSubMenu === menu.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {openSubMenu === menu.name && (
                      <div 
                        className="absolute top-full left-0 mt-1 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 min-w-48 py-2 z-50"
                        onMouseEnter={() => handleMouseEnter(menu.name)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {menu.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150"
                            onClick={() => setOpenSubMenu(null)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileOpen(!mobileOpen);
                }}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileOpen && (
              <div 
                className="md:hidden bg-blue-700 rounded-lg mt-3 py-2 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {menuItems.map((menu) => (
                  <div key={menu.name} className="border-b border-blue-600 last:border-b-0">
                    <button
                      className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-blue-800 transition-colors"
                      onClick={() => toggleSubMenu(menu.name)}
                    >
                      <span className="font-medium">{menu.name}</span>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${
                          openSubMenu === menu.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {openSubMenu === menu.name && (
                      <div className="bg-blue-800 py-1">
                        {menu.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-8 py-2 hover:bg-blue-900 transition-colors"
                            onClick={() => {
                              setMobileOpen(false);
                              setOpenSubMenu(null);
                            }}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300 py-6 text-center">
          <div className="container mx-auto px-4">
            <p className="text-sm">
              © {new Date().getFullYear()} Utility Services. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}