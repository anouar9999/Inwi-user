import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Settings,
  Users,
  Trophy,
  Star,
  Search,
  Check,
  Trash,
  Save,
  Shield,
  AlertTriangle,
  Loader2,
  Award,
  BarChart2,
  Users2,
  Target,
} from 'lucide-react';

const TeamSidebar = ({ isOpen, onClose, team }) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgb(82, 82, 91);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgb(113, 113, 122);
        }
      `}</style>

      <div className="fixed inset-0 z-50">
        {/* Backdrop with blur */}
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-md" 
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Sidebar container */}
        <div className="fixed inset-y-0 right-0 w-full max-w-6xl overflow-y-auto">
          <div className="min-h-full bg-secondary/50 backdrop-blur-xl">
            {/* Header */}
            <div className="sticky top-0 z-10 backdrop-blur-xl header-fade">
              <div className="relative h-48">
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: team?.image 
                        ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/${team.image})`
                        : 'url(/api/placeholder/1200/300)',
                      filter: 'brightness(0.4)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/60 to-gray-900" />
                </div>

                {/* Header Content */}
                <div className="relative px-8 py-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      {/* Team Logo */}
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-purple-500/20">
                        <img
                          src={team?.image 
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${team.image}`
                            : '/api/placeholder/80/80'
                          }
                          alt={team?.name || 'Team logo'}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>

                      {/* Team Info */}
                      <div className="space-y-2">
                        <h2 className="text-3xl tracking-wider font-custom text-white">
                          {team?.name || 'Team Management'}
                        </h2>
                        <div className="flex items-center gap-6 text-gray-300 font-pilot">
                          <div className="flex items-center gap-2">
                            <Users size={18} className="text-primary" />
                            <span className="text-lg">{team?.total_members || 0} Members</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-yellow-400" />
                            <span className="text-lg">Division {team?.division || 'Unranked'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 p-3 hover:bg-gray-800/50 rounded-xl transition-all duration-300 hover:scale-105 group"
                    >
                      <X size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8 py-4 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50">
              <div className="flex gap-3 font-pilot">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart2 },
                  { id: 'members', label: 'Members', icon: Users },
                  { id: 'requests', label: 'Requests', icon: UserPlus },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-300
                      ${activeTab === tab.id 
                        ? 'bg-primary/50 text-white shadow-lg shadow-purple-500/20 scale-105'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                      }`}
                  >
                    <tab.icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
              {/* Add your tab content here, similar to CreateTeamForm sections */}
              <div className="space-y-6 font-pilot">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Add your overview stats cards here */}
                  </div>
                )}
                
                {activeTab === 'members' && (
                  <div className="space-y-6">
                    {/* Add your members list here */}
                  </div>
                )}
                
                {activeTab === 'requests' && (
                  <div className="space-y-6">
                    {/* Add your requests list here */}
                  </div>
                )}
                
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    {/* Add your settings form here */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamSidebar;