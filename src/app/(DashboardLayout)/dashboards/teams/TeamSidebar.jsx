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
  Clock,
  Medal,
} from 'lucide-react';
import { useToast } from '@/app/components/toast/ToastProviderContext';
import FloatingLabelTextArea from '@/app/components/FloatingTextArea';
import FloatingLabelInput from '@/app/components/input/FloatingInput';
import FloatingSelectField from '../../components/FloatingSelectField';
const StatCard = ({ icon: Icon, value, label, trend, gradient }) => (
  <div
    className={`${gradient} relative overflow-hidden group angular-cut rounded-xl p-6 transition-all duration-300 hover:scale-105`}
  >
    <div className="relative flex flex-col items-center">
      <div className="p-4 bg-white/5 rounded-xl mb-4 group-hover:scale-110 transition-transform">
        <Icon className="text-white" size={28} />
      </div>
      <span className="text-3xl font-bold text-white">{value}</span>
      <span className="text-sm font-valorant text-gray-300">{label}</span>
      {trend !== undefined && (
        <span
          className={`absolute top-4 right-4 text-sm font-medium ${
            trend >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {trend > 0 && '+'}
          {trend}%
        </span>
      )}
    </div>
  </div>
);
const defaultAvatarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="64" fill="#1F2937"/>
  <path d="M108 128C108 103.699 88.3005 84 64 84C39.6995 84 20 103.699 20 128" fill="#374151"/>
  <circle cx="64" cy="50" r="24" fill="#374151"/>
</svg>
`;
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
const TeamSidebar = ({ isOpen, onClose, team, onTeamUpdate  }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [teamSettings, setTeamSettings] = useState(null);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    description: '',
    privacy_level: 'Public',
    team_game: 'Valorant',
    division: 'any',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { addToast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (team) {
      setSettingsForm({
        name: team.name || '',
        description: team.description || '',
        privacy_level: team.privacy_level || 'Public',
        team_game: team.team_game || 'Valorant',
        division: team.division || 'any',
      });
    }
  }, [team]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && team?.id) {
      fetchTeamData();
    }
  }, [isOpen, team?.id]);

  const fetchTeamData = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchConfig = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      };

      const [statsRes, membersRes, requestsRes, settingsRes] = await Promise.all([
        fetch(`${API_URL}/api/team_api.php?endpoint=team-stats&team_id=${team.id}`, fetchConfig),
        fetch(`${API_URL}/api/team_api.php?endpoint=team-members&team_id=${team.id}`, fetchConfig),
        fetch(`${API_URL}/api/team_api.php?endpoint=team-requests&team_id=${team.id}`, fetchConfig),
        fetch(`${API_URL}/api/team_api.php?endpoint=team-settings&team_id=${team.id}`, fetchConfig),
      ]);

      const [statsData, membersData, requestsData, settingsData] = await Promise.all([
        statsRes.json(),
        membersRes.json(),
        requestsRes.json(),
        settingsRes.json(),
      ]);
      console.log(statsData, membersData, requestsData, settingsData);

      if (!statsRes.ok || !membersRes.ok || !requestsRes.ok || !settingsRes.ok) {
        throw new Error('Failed to fetch team data');
      }

      setTeamStats(statsData.data);
      setMembers(membersData.data);
      setRequests(requestsData.data);
      setTeamSettings(settingsData.data);
      setSettingsForm((prev) => ({
        ...prev,
        ...settingsData.data,
      }));
    } catch (err) {
      setError('Failed to load team data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setActionLoading(true);
    try {
      // Map the action to the correct status expected by the API
      const apiAction = action === 'accept' ? 'accepted' : 'rejected';

      const response = await fetch(`${API_URL}/api/team_api.php?endpoint=team-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: team.id,
          request_id: requestId,
          action: apiAction, // Use the mapped action value
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} the request`);
      }

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success',
          message: `Request ${action}ed successfully`, // Fixed grammar
          duration: 5000,
          position: 'bottom-right',
        });
        fetchTeamData();
      } else {
        throw new Error(data.message || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      addToast({
        type: 'error',
        message: `Failed to ${action} request: ${error.message}`,
        duration: 5000,
        position: 'bottom-right',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/team_api.php?endpoint=team-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: team?.id,
          ...settingsForm,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const result = await response.json();

      if (result.success) {
        addToast({
          type: 'success', // 'success' | 'error' | 'warning' | 'info'
          message: 'Team settings updated successfully',
          duration: 5000, // optional, in ms
          position: 'bottom-right', // optional
        });
        // Refresh local data
        await fetchTeamData();
        // Refresh parent component data
        if (onTeamUpdate) {
          onTeamUpdate();
        }
      } else {
        throw new Error(result.message || 'Failed to update settings');
      }
    } catch (err) {
      setError('Failed to update settings. Please try again.');

      addToast({
        type: 'error', // 'success' | 'error' | 'warning' | 'info'
        message: err.message,
        duration: 5000, // optional, in ms
        position: 'bottom-right', // optional
      });
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/team_api.php?endpoint=team-settings&team_id=${team.id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete team');
      }

      const result = await response.json();

      if (result.success) {
        addToast({
          type: 'success', // 'success' | 'error' | 'warning' | 'info'
          message: 'Team deleted successfully',
          duration: 5000, // optional, in ms
          position: 'bottom-right', // optional
        });
        // Close the sidebar
        onClose();
        // Refresh parent component data
        if (onTeamUpdate) {
          onTeamUpdate();
        }
      } else {
        throw new Error(result.message || 'Failed to delete team');
      }
    } catch (err) {
      setError('Failed to delete team. Please try again.');

      addToast({
        type: 'error', // 'success' | 'error' | 'warning' | 'info'
        message: err.message,
        duration: 5000, // optional, in ms
        position: 'bottom-right', // optional
      });
    }
  };
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
      <style jsx global>{`
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`}</style>

<div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

        {/* Sidebar container - adjusted max-width for different screens */}
        <div className="fixed inset-y-0 right-0 w-full max-w-[90%] md:max-w-2xl lg:max-w-4xl xl:max-w-6xl overflow-y-auto">
          <div className="min-h-full bg-secondary/50 backdrop-blur-xl">
            {/* Header - made responsive */}
            <div className="sticky top-0 z-10 backdrop-blur-xl header-fade">
              <div className="relative h-auto md:h-36">
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: team?.image
                        ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/${team.image})`
                        : 'url(/api/placeholder/1200/300)',
                      filter: 'brightness(0.4)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/60 to-gray-900" />
                </div>

                {/* Header Content - made responsive */}
                <div className="relative px-4 md:px-8 py-4 md:py-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                      {/* Team Logo */}
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-purple-500/20">
                        <img
                          src={team?.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${team.image}` : '/api/placeholder/80/80'}
                          alt={team?.name || 'Team logo'}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>

                      {/* Team Info */}
                      <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl tracking-wider font-custom text-white">
                          {team?.name || 'Team Management'}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-300 font-pilot">
                          <div className="flex items-center gap-2">
                            <Users size={18} className="text-primary" />
                            <span className="text-base md:text-lg">{team?.total_members || 0} Members</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-yellow-400" />
                            <span className="text-base md:text-lg">Division {team?.division || 'Unranked'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={onClose}
                      className="absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-3 hover:bg-gray-800/50 rounded-xl transition-all duration-300 hover:scale-105 group"
                    >
                      <X size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs - made responsive */}
     {/* Navigation Tabs */}
<div className="px-4 md:px-8 py-3 md:py-4 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50">
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 font-pilot">
    {[
      { id: 'overview', label: 'Overview', icon: BarChart2 },
      { id: 'members', label: 'Members', icon: Users },
      { id: 'requests', label: 'Requests', icon: UserPlus },
      { id: 'settings', label: 'Settings', icon: Settings },
    ].map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`
          flex items-center justify-center gap-2 
          px-4 py-2.5 rounded-lg transition-all duration-300
          ${activeTab === tab.id
            ? 'bg-primary/50 text-white shadow-lg shadow-purple-500/20'
            : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
          }
        `}
      >
        <tab.icon size={18} />
        <span className="font-medium">{tab.label}</span>
      </button>
    ))}
  </div>
</div>

            {/* Main Content */}
            <div className="p-4 md:p-8">
              <div className="space-y-4 md:space-y-6 font-pilot">
                {activeTab === 'overview' && (
                  <div className="space-y-4 md:space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard
                        icon={Users2}
                        value={teamStats?.total_members || 0}
                        label="Total Members"
                        trend={12}
                        gradient="bg-gradient-to-br from-purple-500/10 to-blue-500/10"
                      />
                      <StatCard
                        icon={Target}
                        value={`${teamStats?.win_rate || 0}%`}
                        label="Win Rate"
                        trend={teamStats?.win_rate_trend}
                        gradient="bg-gradient-to-br from-green-500/10 to-emerald-500/10"
                      />
                      <StatCard
                        icon={Award}
                        value={teamStats?.regional_rank || '-'}
                        label="Regional Rank"
                        gradient="bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
                      />
                      <StatCard
                        icon={Star}
                        value={teamStats?.mmr || 0}
                        label="Team MMR"
                        gradient="bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-6 border border-gray-700/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Trophy className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-400">Average Rank</div>
                            <div className="text-2xl font-valorant text-white mt-2">
                              {teamStats?.average_rank || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-6 border border-gray-700/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-yellow-500/10 rounded-xl">
                            <Medal className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-400">Division</div>
                            <div className="text-2xl font-valorant text-white mt-2">
                              {teamStats?.division || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'members' && (
                  <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-secondary/50 backdrop-blur-sm rounded-xl pl-12 pr-4 py-3 md:py-4 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members
                        .filter(
                          (member) =>
                            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            member.role.toLowerCase().includes(searchQuery.toLowerCase()),
                        )
                        .map((member) => (
                          <MemberCard
                            key={member.id}
                            member={member}
                            isOwner={member.user_id === team?.owner_id}
                          />
                        ))}
                      {members.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400 bg-secondary/20 backdrop-blur-sm rounded-xl">
                          <Users className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                          <p className="text-lg font-medium">No members found</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Add some members to get started
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
<div className="grid grid-cols-1 gap-4">
{activeTab === 'requests' && (
  <div className="space-y-4 md:space-y-6">
    {/* Header with Stats */}
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-secondary/40 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-gray-700/30">
        <div className="flex items-center gap-3 text-primary/90">
          <UserPlus className="w-5 h-5 md:w-6 md:h-6" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">Pending Requests</h3>
            <p className="text-xl md:text-2xl font-bold text-white">{requests.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-secondary/40 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-gray-700/30">
        <div className="flex items-center gap-3 text-emerald-500">
          <Check className="w-5 h-5 md:w-6 md:h-6" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">Accepted Today</h3>
            <p className="text-xl md:text-2xl font-bold text-white">0</p>
          </div>
        </div>
      </div>
    </div>

    {/* Requests List */}
    <div className="flex flex-col gap-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="bg-secondary/40 hover:bg-secondary/60 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-gray-700/30 transition-all"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden ring-2 ring-primary/20">
                <img
                  src={
                    request.avatar
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${request.avatar}`
                      : `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`
                  }
                  alt={request.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <h4 className="text-base md:text-lg font-semibold text-white">
                    {request.name}
                  </h4>
                  <span className="px-2 md:px-3 py-1 bg-primary/10 text-xs font-medium text-primary/90 rounded-full">
                    New Request
                  </span>
                </div>
                <p className="text-gray-400 mt-1 text-sm md:text-base line-clamp-2">{request.message}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 md:px-3 py-1 md:py-1.5 bg-gray-700/50 text-xs font-medium text-gray-300 rounded-lg">
                    {request.rank || 'Unranked'}
                  </span>
                  <span className="px-2 md:px-3 py-1 md:py-1.5 bg-gray-700/50 text-xs font-medium text-gray-300 rounded-lg">
                    {request.region || 'Region Unknown'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-3 w-full sm:w-auto mt-3 sm:mt-0">
                <button
                  onClick={() => handleRequestAction(request.id, 'reject')}
                  className="flex-1 sm:flex-initial px-3 md:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Decline</span>
                </button>
                <button
                  onClick={() => handleRequestAction(request.id, 'accept')}
                  className="flex-1 sm:flex-initial px-3 md:px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Accept</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {requests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4 bg-secondary/20 backdrop-blur-sm rounded-xl border border-gray-700/30">
          <UserPlus className="w-10 h-10 md:w-12 md:h-12 text-gray-500 mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
            No Pending Requests
          </h3>
          <p className="text-sm md:text-base text-gray-400 text-center max-w-md">
            When players request to join your team, they will appear here for review.
          </p>
        </div>
      )}
    </div>
  </div>
)}
</div>
                {activeTab === 'settings' && (
                <div className="space-y-4 md:space-y-6">
                <div className="w-full max-w-2xl mx-auto space-y-6 md:space-y-8">
                  <form onSubmit={handleSettingsSubmit} className="space-y-6 md:space-y-8">
                        <div className="space-y-6">
                          <div>
                            <FloatingLabelInput
                              label={'Team Name'}
                              name={'team_name'}
                              value={settingsForm.name}
                              onChange={(e) =>
                                setSettingsForm({ ...settingsForm, name: e.target.value })
                              }
                            />
                          </div>

                          <div>
                            <FloatingLabelTextArea
                              label={'Team Description'}
                              name={'team_description'}
                              value={settingsForm.description}
                              onChange={(e) =>
                                setSettingsForm({ ...settingsForm, description: e.target.value })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <FloatingSelectField
                                label={'Privacy Level'}
                                value={settingsForm.privacy_level}
                                onChange={(e) =>
                                  setSettingsForm({
                                    ...settingsForm,
                                    privacy_level: e.target.value,
                                  })
                                }
                                options={['Public', 'Private']}
                              />
                            </div>

                            <div>
                              <FloatingSelectField
                                label={'Division'}
                                value={settingsForm.privacy_level}
                                onChange={(e) =>
                                  setSettingsForm({
                                    ...settingsForm,
                                    privacy_level: e.target.value,
                                  })
                                }
                                options={[
                                  'Iron',
                                  'Bronze',
                                  'Silver',
                                  'Gold',
                                  'Platinum',
                                  'Diamond',
                                  'Master',
                                  'Grandmaster',
                                ]}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between pt-8 border-t border-gray-800">
                            <button
                              type="button"
                              onClick={() => setShowDeleteConfirm(true)}
                              className="px-5 py-3 bg-red-500/10 hover:bg-red-500/20 angular-cut text-red-400 transition-all hover:scale-105 flex items-center gap-2"
                            >
                              <Trash className="w-5 h-5" />
                              <span>Delete Team</span>
                            </button>

                            <button
                              type="submit"
                              className="px-6 py-3 bg-gradient-to-r from-primary/50 to-primary/60 hover:from-primary/60 hover:to-primary/70 angular-cut text-white flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
                            >
                              <Save size={20} />
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>{' '}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-4 md:p-8 w-full max-w-md border border-gray-800">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Delete Team</h3>
                      <p className="text-gray-400 mt-1">This action cannot be undone.</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-8">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-white">{team?.name}</span>? All team data,
                    including members and history, will be permanently removed.
                  </p>

                  <div className="flex items-center justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-5 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteTeam();
                        setShowDeleteConfirm(false);
                      }}
                      className="px-5 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <Trash className="w-5 h-5" />
                      <span>Delete Team</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
    </>
  );
};

export default TeamSidebar;
