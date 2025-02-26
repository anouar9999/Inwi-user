'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from './layout/vertical/header/Header';
import Sidebar from './layout/vertical/sidebar/Sidebar';
import { Home, Trophy, Users, GamepadIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Layout = ({ children }) => {
  const [showGlow, setShowGlow] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let timer;
    if (showGlow) {
      timer = setTimeout(() => setShowGlow(false), 1200);
    }
    return () => clearTimeout(timer);
  }, [showGlow]);

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Background and Overlay Container */}
      <div className="fixed top-0 left-0 right-0 h-screen w-full z-0">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://wallpaper.forfun.com/fetch/90/90bcf5ee927d2ac4487970ebb937bef2.jpeg"
            alt="Background"
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="object-center"
          />
        </div>
        
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/95 to-gray-900"></div>
      </div>

      {/* Content */}
      <div className="relative w-full z-10">
        <Header setIsMobileOpen={setIsMobileOpen} />
        <div className="flex flex-1">
          <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
          <main className="font-pilot flex-1 flex flex-col items-center mt-8 mb-4">
            {/* Welcome Message */}
            <div className="rounded-xl mt-16 w-full text-center h-16 mb-20">
              <h2 className="text-4xl font-valorant text-white">
                Welcome Back,{' '}
                {typeof window !== 'undefined' ? localStorage.getItem('username') : 'User'}!
              </h2>
              <p className="font-pilot text-lg px-4 text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
            
            <div className="sm:pl-12 md:pl-16">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;