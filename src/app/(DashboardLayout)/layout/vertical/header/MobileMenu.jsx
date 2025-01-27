import React from 'react';
import { X, Home, Trophy, GamepadIcon, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Profile from './Profile';

const MobileMenu = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  
  const links = [
    { href: '/dashboards/tournaments', icon: Trophy, label: 'Tournaments' },
    { href: '/dashboards/my-tournaments', icon: GamepadIcon, label: 'My Tournaments' },
    { href: '/dashboards/teams', icon: Users, label: 'My Teams' }
  ];

  if (!isOpen) return null;

  const handleLinkClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[999999999999999999999999999999999999999999999999999999]" onClick={onClose}>
      <div className="flex flex-col h-full p-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <Profile />
          <button onClick={onClose} className="text-white p-2">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-4">
            {links.map(({ href, icon: Icon, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer
                    ${pathname === href ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                  onClick={handleLinkClick}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="text-lg">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;