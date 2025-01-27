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
      {/* Background Image (1/2 of screen height) */}
      <div className="absolute top-0 left-0 right-0 h-1/3 z-0 overflow-hidden">
        <Image
          src="https://wallpaper.forfun.com/fetch/90/90bcf5ee927d2ac4487970ebb937bef2.jpeg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gray-900 bg-opacity-90 z-10"></div>

      {/* Header Section */}
      <div className="relative z-20">
        <Header setIsMobileOpen={setIsMobileOpen} />
        <div className="flex flex-1">
          <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
          <main className=" font-pilot flex-1 flex flex-col items-center mt-8  z-30 mb-4">
            {/* Welcome Message */}
            <div className="rounded-xl mt-16 w-full text-center h-16 mb-20 ">
              <h2 className="text-4xl font-valorant text-white">
                Welcome Back,{' '}
                {typeof window !== 'undefined' ? localStorage.getItem('username') : 'User'}!
              </h2>
              <p className='font-pilot text-lg px-4  text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
            
            {/* Navigation Tabs */}
            {/* <nav className="mt-12 pl-2 sm:pl-4 md:pl-8 overflow-x-auto font-pilot ">
              <ul className="flex space-x-4 text-sm text-gray-300 min-w-max">
                <li>
                  <Link href="/">
                    <div className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 
                      ${pathname === '/' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
                      <Home size={20} className="mr-2" />
                      <span>Home</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboards/tournaments">
                    <div className={`flex angular-cut items-center px-4 py-2  transition-all duration-300 hover:bg-white/10 
                      ${pathname === '/dashboards/tournaments' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
                      <Trophy size={20} className="mr-2" />
                      <span>Tournaments</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboards/my-tournaments">
                    <div className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 
                      ${pathname === '/dashboards/my-tournaments' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
                      <GamepadIcon size={20} className="mr-2" />
                      <span>My Tournaments</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboards/teams">
                    <div className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 
                      ${pathname === '/dashboards/teams' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
                      <Users size={20} className="mr-2" />
                      <span>My Teams</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </nav> */}
            <div className=' sm:pl-12 md:pl-16'>

            {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;