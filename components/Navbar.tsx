"use client";

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

const Navbar: React.FC = () => {
  const { theme } = useTheme();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menuItems = [
    {
      title: 'Futures',
      items: [
        { title: 'Future Analysis', href: '/futures/future-analysis' },
        { title: 'Long vs. Short', href: '/futures/long-vs-short' },
        { title: 'Price vs. OI', href: '/futures/price-vs-oi' },
      ],
    },
    {
      title: 'Options',
      items: [
        { title: 'Oi Analysis', href: '/options/oi-analysis' },
        { title: 'Trending Strikes', href: '/options/trending-strikes' },
        { title: 'Call Vs Put OI', href: '/options/call-vs-put-oi' },
        { title: 'Put Call Ratio', href: '/options/put-call-ratio' },
        { title: 'ATM Premium', href: '/options/atm-premium' },
        { title: 'Implied Volatility', href: '/options/implied-volatility' },
        { title: 'Multi-Strike OI', href: '/options/multi-strike-oi' },
        { title: 'OI Internal Value', href: '/options/oi-internal-value' },
        { title: 'Premium Decay', href: '/options/premium-decay' },
        { title: 'Long & Short', href: '/options/long-and-short' },
        { title: 'Price Vs OI', href: '/options/price-vs-oi' },
      ],
    },
    {
      title: 'Strategy',
      items: [
        { title: 'Straddle', href: '/strategy/straddle' },
        { title: 'Strangle', href: '/strategy/strangle' },
        { title: 'MultiStrike Straddle', href: '/strategy/multistrike-straddle' },
        { title: 'Straddle SnapShot', href: '/strategy/straddle-snapshot' },
      ],
    },
    {
      title: 'About',
      items: [
        { title: 'Company', href: '/company' },
        { title: 'Team', href: '/team' },
        { title: 'Contact', href: '/contact' },
      ],
    },
  ];

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <nav
      className="sticky top-0 z-40 w-full border-b"
      style={{
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.card.border,
      }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <span
          className="text-xl font-bold"
          style={{ color: theme.colors.text, fontFamily: theme.fonts.primary }}
        >
          O1 Data
        </span>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((menuItem) => (
              <div key={menuItem.title} className="relative">
                <button
                  onClick={() => toggleDropdown(menuItem.title)}
                  className="flex items-center text-sm font-medium hover:opacity-80"
                  style={{ color: theme.colors.text, fontFamily: theme.fonts.primary }}
                >
                  {menuItem.title}
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openDropdown === menuItem.title && (
                  <div
                    className="absolute left-0 mt-2 w-56 rounded-md shadow-lg py-1 z-50"
                    style={{
                      backgroundColor: theme.colors.card.bg,
                      borderColor: theme.colors.card.border,
                    }}
                  >
                    {menuItem.items.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="block px-4 py-2 text-sm hover:opacity-80"
                        style={{
                          color: theme.colors.text,
                          fontFamily: theme.fonts.primary,
                        }}
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="px-4 py-2 text-sm font-medium rounded-md"
            style={{
              backgroundColor: theme.colors.button.bg,
              color: theme.colors.button.text,
              fontFamily: theme.fonts.primary,
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
