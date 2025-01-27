import React, { useEffect, useState } from 'react';
import { X, UserPlus, Trophy, Shield, Users, Star, Award, Target, Clock } from 'lucide-react';

const NonOwnerView = ({ team, isOpen, onClose, onJoinRequest }) => {
  const [isInvolved, setIsInvolved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkTeamInvolvement = async () => {
      if (!team) return;

      const userId = localStorage.getItem('userId');
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // First check if user is team owner
        if (team.owner_id === parseInt(userId)) {
          setIsInvolved(true);
          setIsLoading(false);
          return;
        }

        // Then check team membership
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check_team_involvement.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            team_id: team.id,
            user_id: userId
          })
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {

          setIsInvolved(data.is_involved);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error checking team involvement:', error);
        setError('Failed to check team membership status');
      } finally {
        setIsLoading(false);
      }
    };

    checkTeamInvolvement();
  }, [team]);

  
  if (!team || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
        
        <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all bg-secondary/50 backdrop-blur-xl rounded-2xl shadow-2xl">
          {/* Hero Header */}
         {/* Responsive Team Header */}
<div className="relative h-auto md:h-40">
  {/* Background Image */}
  <div className="absolute inset-0 overflow-hidden">
    <div 
      className="w-full h-full bg-cover bg-center"
      style={{
        backgroundImage: team.image 
          ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/${team.image})`
          : 'url(/api/placeholder/1200/300)',
        filter: 'brightness(0.4)'
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/60 to-gray-900" />
  </div>

  <div className="relative px-4 md:px-8 py-6 md:py-16">
    <div className="flex flex-col md:flex-row gap-6 md:gap-0 md:items-center justify-between">
      {/* Team Info - Left Side */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center w-full">
        <div className="flex gap-4 md:gap-6 items-center">
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.image}` || '/api/placeholder/48/48'}
            alt="Team Logo"
            className="w-12 h-12 rounded-lg"
          />
          <div>
            <h2 className="text-lg md:text-xl font-valorant text-white flex items-center gap-2 flex-wrap">
              {team.name}
              <span className="text-sm px-2 py-1 bg-primary/20 rounded text-primary">Bot</span>
            </h2>
            <p className="text-gray-400 text-sm">Founded {new Date(team.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Stats - Centered on mobile, right-aligned on desktop */}
        <div className="flex gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
          {[
            { label: 'WIN', value: '454', color: 'text-blue-400' },
            { label: 'LOSES', value: '673', color: 'text-gray-400' },
            { label: 'TIE', value: '68', color: 'text-yellow-400' }
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className={`text-xl md:text-2xl font-valorant ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-xs md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Join Button - Full width on mobile */}
      {!isInvolved && (
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <button
            onClick={() => onJoinRequest(team.id)}
            className="group relative flex items-center w-full md:w-44 overflow-hidden bg-violet-600"
          >
            {/* Hidden lighter section that shows on hover */}
            <div className="absolute left-0 top-0 bg-primary/60 h-full w-0 
              transition-all duration-300 ease-out group-hover:w-12" 
            />
            
            {/* Button content */}
            <div className="h-12 w-full flex items-center justify-between px-4">
              <span className="relative z-10 font-custom tracking-wider text-white uppercase">
                join the team
              </span>
              
              <span className="text-white font-custom transition-all duration-300 
                transform translate-x-0 group-hover:translate-x-1"
              >
                →
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Close Button - Adjusted position */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-3 
          hover:bg-gray-800/50 rounded-xl transition-all duration-300 
          hover:scale-105 group z-10"
      >
        <X size={20} className="text-gray-400 group-hover:text-white transition-colors" />
      </button>
    </div>
  </div>
</div>

         

          {/* About Section */}
          <div className="bg-gray-900 p-6">
            <h3 className="text-white font-valorant mb-4">ABOUT THE TEAM</h3>
            <SocialLinks />
            <p className="text-gray-400 leading-relaxed">
              {team.description || "Prior to major incidents in the Overwatch League, there were known cases of controversial acts."}
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
          
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Users} value={team.total_members} label="Members" gradient="bg-purple-500/10" />
              <StatCard icon={Trophy} value={`${team.win_rate}%`} label="Win Rate" gradient="bg-green-500/10" />
              <StatCard icon={Star} value={team.mmr} label="Team MMR" gradient="bg-yellow-500/10" />
              <StatCard icon={Award} value={team.regional_rank || '-'} label="Regional Rank" gradient="bg-blue-500/10" />
            </div>

            <TeamDetails team={team} />
            <TeamMembers team={team} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLinks = () => (
  <div className="flex gap-4 mb-4">
    {['twitter', 'facebook', 'dribbble'].map(platform => (
      <a key={platform} href="#" className="text-gray-400 hover:text-white">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          {platform === 'twitter' && <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>}
          {platform === 'facebook' && <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>}
          {platform === 'dribbble' && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.424 25.424 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"/>}
        </svg>
      </a>
    ))}
  </div>
);

const StatsGrid = () => (
  <div className="grid grid-cols-3 gap-4 mb-8">
    {[
      { label: 'WIN', value: '454', color: 'text-blue-400' },
      { label: 'LOSES', value: '673', color: 'text-purple-400' },
      { label: 'TIE', value: '68', color: 'text-yellow-400' }
    ].map(stat => (
      <div key={stat.label} className="bg-primary/5 backdrop-blur-sm rounded-xl p-4 text-center">
        <span className={`text-2xl font-valorant ${stat.color}`}>{stat.value}</span>
        <p className="text-sm font-pilot text-gray-400 mt-1">{stat.label}</p>
      </div>
    ))}
  </div>
);

const StatCard = ({ icon: Icon, value, label, gradient }) => (
  <div className={`${gradient} rounded-xl p-6 group hover:scale-105 transition-all duration-300`}>
    <div className="flex flex-col items-center">
      <div className="p-3 bg-white/5 rounded-lg mb-2 group-hover:scale-110 transition-transform">
        <Icon size={24} className="text-white" />
      </div>
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-sm font-valorant text-gray-300">{label}</span>
    </div>
  </div>
);

const TeamDetails = ({ team }) => (
  <div className="bg-gray-800/30 rounded-xl p-6">
    <div className="grid grid-cols-2 gap-6">
      {[
        { label: 'Average Rank', value: team.average_rank, icon: Target },
        { label: 'Active Members', value: `${team.active_members} / ${team.total_members}`, icon: Users },
        { label: 'Privacy Level', value: team.privacy_level, icon: Shield },
        { label: 'Created', value: new Date(team.created_at).toLocaleDateString(), icon: Clock }
      ].map(item => (
        <DetailItem key={item.label} label={item.label} value={item.value} icon={<item.icon size={16} className="text-primary" />} />
      ))}
    </div>
  </div>
);

const DetailItem = ({ label, value, icon }) => (
  <div>
    <h4 className="text-sm font-pilot text-gray-400 mb-1">{label}</h4>
    <p className="text-xl font-valorant text-white flex items-center gap-2">
      {icon}
      {value}
    </p>
  </div>
);

const TeamMembers = ({ team }) => (
  <div>
    <h3 className="text-lg font-valorant text-white mb-4 flex items-center gap-2">
      <Users size={20} className="text-primary" />
      Team Members
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {team.members.map((member) => (
        <MemberCard key={member.id} member={member} isOwner={member.user_id === team.owner_id} />
      ))}
    </div>
  </div>
);

const MemberCard = ({ member, isOwner }) => {
  const defaultAvatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <circle cx="64" cy="64" r="64" fill="#1F2937"/>
    <path d="M108 128C108 103.699 88.3005 84 64 84C39.6995 84 20 103.699 20 128" fill="#374151"/>
    <circle cx="64" cy="50" r="24" fill="#374151"/>
  </svg>`;

  return (
    <div className="group relative bg-secondary/40 hover:bg-secondary/60 backdrop-blur-sm p-2 sm:p-3 transition-all rounded-xl border border-gray-700/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
        {/* Avatar */}
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 overflow-hidden rounded-xl ring-2 ring-primary/20 flex-shrink-0">
          <img
            src={member.avatar ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${member.avatar}` : `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0">
          <div className="font-valorant text-base sm:text-lg text-white truncate">
            {member.name}
          </div>
          <div className="flex flex-wrap gap-2 mt-1.5">
            <span className="inline-flex px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700/50 text-xs sm:text-sm font-medium text-gray-300 rounded-lg">
              {member.role}
            </span>
            <span className="inline-flex px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/10 text-xs sm:text-sm font-medium text-primary rounded-lg">
              {member.rank}
            </span>
            {isOwner && (
              <span className="inline-flex px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-500/10 text-xs sm:text-sm font-medium text-yellow-400 rounded-lg">
                Team Owner
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonOwnerView;