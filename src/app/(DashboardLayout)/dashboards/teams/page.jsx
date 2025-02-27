'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { PlusCircle, Search, UserCircle, X, UserPlus } from 'lucide-react';
import TeamSidebar from './TeamSidebar';
import CreateTeamForm from './CreateTeamForm';
import NonOwnerView from './NonOwnerView';
import { ToastProvider, addToast, useToast } from '@/app/components/toast/ToastProviderContext';
import TeamCard from './TeamCard';
import AddTeamCard from './AddTeamCard';

// Constants
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Custom Hooks
const useTeamsData = (userId) => {
  const [teamsData, setTeamsData] = useState({
    allTeams: [],
    myTeams: [],
    isLoading: true,
    error: null,
  });

  const fetchTeams = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/get_teams.php`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Better error handling
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || `HTTP error! status: ${response.status}`;
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success) {
        const allTeamsData = result.data || [];
        const userOwnedTeams = allTeamsData.filter(
          (team) =>
            parseInt(team.owner_id) === userId ||
            team.members?.some((member) => parseInt(member.user_id) === userId),
        );

        setTeamsData({
          allTeams: allTeamsData,
          myTeams: userOwnedTeams,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(result.message || 'Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeamsData((prev) => ({
        ...prev,
        isLoading: false,
        error,
      }));
      // Don't use toast directly, let the component handle errors
      return error;
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchTeams();
    } else {
      setTeamsData({
        allTeams: [],
        myTeams: [],
        isLoading: false,
        error: null,
      });
    }
  }, [userId, fetchTeams]);

  return { ...teamsData, refreshTeams: fetchTeams };
};

// SearchBar Component
const SearchBar = ({ value, onChange }) => (
  <div className="relative w-full">
    <input
      type="text"
      placeholder="Rechercher une équipe..."
      className="w-full bg-secondary/95 text-white px-10 py-2 sm:py-3 angular-cut"
      value={value}
      onChange={onChange}
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
  </div>
);

// Main Component
const TeamPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');
  const { addToast } = useToast();
  const [userId, setUserId] = useState(null);  // Add state for userId

  // Move localStorage to useEffect
  useEffect(() => {
    // Access localStorage only after component mounts (client-side)
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(parseInt(id));
    }
  }, []);

  const { allTeams, myTeams, isLoading, refreshTeams } = useTeamsData(userId);

  const handleTeamUpdate = useCallback(() => {
    refreshTeams();
  }, [refreshTeams]);

  const handleAddTeam = () => {
    if (!userId) {
      addToast({  // Changed from toast.error to addToast
        type: 'error',
        message: 'Please login to create a team',
        duration: 5000,
        position: 'bottom-right'
      });
      return;
    }
    setIsCreateTeamOpen(true);
  };

  const handleJoinTeamRequest = async (teamId) => {
    if (!userId) {
      addToast({  // Changed from toast.error to addToast
        type: 'error',
        message: 'Please login to join a team',
        duration: 5000,
        position: 'bottom-right'
      });
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/team_api.php?endpoint=join-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: teamId,
          user_id: userId,
          role: 'Mid', // You can make this dynamic based on user selection
          rank: 'Unranked', // You can make this dynamic based on user's actual rank
        }),
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success',
          message: 'Join request sent successfully!',
          duration: 5000,
          position: 'bottom-right',
        });
        setSidebarOpen(false);
      } else {
        throw new Error(data.message || 'Failed to send join request');
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      addToast({
        type: 'error',
        message: error.message,
        duration: 5000,
        position: 'bottom-right',
      });
    }
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedTeam(null);
  };

  const filteredTeams = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return {
      all: allTeams.filter((team) => team.name.toLowerCase().includes(searchTermLower)),
      my: myTeams.filter((team) => team.name.toLowerCase().includes(searchTermLower)),
    };
  }, [searchTerm, allTeams, myTeams]);

  const isTeamOwner = (team) => {
    return parseInt(team?.owner_id) === userId;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-t-2 border-b-2 border-primary/50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12">
        {myTeams.length === 0 ? (
          <div className="flex justify-center px-4">
            <div className="w-full max-w-sm">
              <AddTeamCard onClick={handleAddTeam} />
            </div>
          </div>
        ) : (
          <section className="space-y-4 sm:space-y-6">
            <h3 className="text-4xl sm:text-5xl lg:text-6xl text-white tracking-wider font-custom 
                        text-center sm:text-left leading-tight">
              YOUR TEAM HEADQUARTERS
              <br />
              <span className="text-primary">UNITE AND TRIUMPH</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AddTeamCard onClick={handleAddTeam} />
              {myTeams.map((team) => (
                <TeamCard key={team.id} team={team} onClick={handleTeamClick} />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4 sm:space-y-6">
          <h3 className="text-4xl sm:text-5xl lg:text-6xl text-white tracking-wider font-custom 
                      text-center sm:text-left leading-tight">
            TEAM ALLIANCE HUB
            <br />
            <span className="text-primary">CONNECT AND CONQUER</span>
          </h3>

          <div className="max-w-md w-full mx-auto sm:mx-0">
            <SearchBar 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredTeams.all.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>Aucune équipe ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTeams.all.map((team) => (
                <TeamCard key={team.id} team={team} onClick={handleTeamClick} />
              ))}
            </div>
          )}
        </section>

        {selectedTeam && (
          <>
            {isTeamOwner(selectedTeam) ? (
              <TeamSidebar
                team={selectedTeam}
                isOpen={sidebarOpen}
                onClose={handleCloseSidebar}
                activeTab={activeSidebarTab}
                setActiveTab={setActiveSidebarTab}
                onTeamUpdate={handleTeamUpdate}
                currentUserId={userId}
                className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md lg:max-w-lg"
              />
            ) : (
              <NonOwnerView
                team={selectedTeam}
                isOpen={sidebarOpen}
                onClose={handleCloseSidebar}
                onJoinRequest={handleJoinTeamRequest}
                className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md lg:max-w-lg"
              />
            )}
          </>
        )}
        <CreateTeamForm
          isOpen={isCreateTeamOpen}
          onClose={() => setIsCreateTeamOpen(false)}
          onFinish={refreshTeams}
        />
      </div>
    </div>
  );
};

export default TeamPage;