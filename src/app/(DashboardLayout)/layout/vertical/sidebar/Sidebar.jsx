'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Settings, Home, Users, ChevronRight, Gamepad2, X, Gamepad, Users2 } from 'lucide-react';
import CustomButton from '@/app/(DashboardLayout)/CustomButton';
import Profile from '@/app/(DashboardLayout)/dashboards/settings/page';
import ProfileDropdown from '../header/Profile';
import Image from 'next/image';

const menuItems = [
  { id: 1, icon: Gamepad2, name: 'Tournaments', href: '/dashboards/tournaments' },
  { id: 2, icon: Gamepad, name: 'My Tournament', href: '/dashboards/my-tournaments' },
  { id: 3, icon: Users2, name: 'teams', href: '/dashboards/teams' },

  { id: 4, icon: Settings, name: 'Settings', href: '/dashboards/settings' },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const isOpen = isMobile ? isMobileOpen : isExpanded;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-secondary  z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full ${
          isOpen ? 'w-full md:w-64' : 'w-16'
        } md:left-5 md:top-24 md:h-[calc(100vh-96px)]    flex flex-col items-center py-6 rounded-none md:rounded-2xl  transition-all duration-300 z-50 ${
          isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0  z-[999999]'
        }`}
      >
        {/* Close button for mobile */}
        {isMobile && isMobileOpen && (
          <>
            <div className={`absolute top-4 left-4 p-2  w-28 h-12 md:w-32 md:h-20 `}>
              <Link href={'/'}>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
                  alt="Logo"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </Link>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Menu items container with added top padding */}
        <div className="flex flex-col items-start space-y-6 mb-auto w-full px-3 pt-12 ">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.id}
                className="w-full"
                onClick={() => isMobile && setIsMobileOpen(false)}
              >
                <div
                  className={`relative flex items-center justify-start w-full h-10 rounded-xl  transition-all duration-300 ${
                    isActive ? 'bg-primary  shadow-md' : 'hover:bg-gray-800'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'} ml-2`}
                    strokeWidth={2}
                  />
                  {isOpen && (
                    <span className={`ml-3 text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {item.name}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute right-0 w-1.5 h-5 bg-primary rounded-l-full"></div>
                  )}
                </div>
              </Link>
            );
          })}

          {/* New Tournament Button (visible only when open) */}
        </div>

        {/* Profile (visible only when open) */}
        {isOpen && (
          <div className="mt-auto mb-4 w-full px-3">
            <ProfileDropdown />
          </div>
        )}

        {/* {!isMobile && (
          
          <button
            onClick={handleToggle}
            className="mt-auto p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
          >dd
            <ChevronRight
              className={`w-6 h-6 text-white transform transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        )} */}
      </aside>
    </>
  );
};

export default Sidebar;
