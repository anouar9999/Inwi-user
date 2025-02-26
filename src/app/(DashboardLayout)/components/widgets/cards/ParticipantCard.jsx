import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HelpCircle, Trophy, Shield, UserCircle, Users } from 'lucide-react';
import Image from 'next/image';

const DefaultAvatar = ({ isTeam }) => (
  <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-900 to-gray-900" />
    {isTeam ? (
      <Shield className="w-6 h-6 xs:w-8 xs:h-8 md:w-10 md:h-10 text-gray-400 relative z-10" strokeWidth={1.5} />
    ) : (
      <UserCircle className="w-6 h-6 xs:w-8 xs:h-8 md:w-10 md:h-10 text-gray-400 relative z-10" strokeWidth={1.5} />
    )}
    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent" />
  </div>
);

const ParticipantOrTeamCard = ({ item }) => {
  const isTeam = item.type === 'team';
  const isCurrentUser = !isTeam && localStorage.getItem('username') === item.username;
  const avatarSrc = isTeam 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.team_avatar}` 
    : item.avatar;

  return (
    <div className="group relative bg-gray-800/80 angular-cut shadow-lg overflow-hidden
      backdrop-blur-sm duration-300 h-full">
      <div className="relative h-14 xs:h-16 sm:h-20">
        {avatarSrc ? (
          <Image
            className="w-full h-full object-cover"
            src={avatarSrc}
            alt={`${isTeam ? item.team_name : item.username}'s avatar`}
            width={192}
            height={128}
          />
        ) : (
          <DefaultAvatar isTeam={isTeam} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      <div className="p-2 xs:p-2.5 sm:p-3">
        <div className="flex items-center justify-between">
          <h5 className="text-xs xs:text-sm sm:text-base font-semibold text-white truncate">
            {isTeam ? item.team_name : item.username}
            {isCurrentUser && <span className="ml-1 text-xs text-primary">(You)</span>}
          </h5>
        </div>

        <div className="mt-0.5 xs:mt-1 flex items-center text-xs text-gray-400">
          {isTeam ? (
            <>
              <Users className="w-3 h-3 mr-1" />
              <span className="text-xs">{item.member_count || '0'} members</span>
            </>
          ) : (
            <>
              <Trophy className="w-3 h-3 mr-1" />
              <span className="text-xs">{item.tournaments_count || '0'} tournaments</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ParticipantCardGrid = ({ tournamentId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tournamentType, setTournamentType] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_accepted_participants.php?tournament_id=${tournamentId}`
        );
        if (response.data.success) {
          setParticipants(response.data.participants);
          setTournamentType(response.data.tournament_type);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch participants. Please try again later.');
        console.error('Error fetching participants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 xs:h-40 sm:h-48">
        <div className="animate-spin rounded-full h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center text-xs xs:text-sm sm:text-base p-4">
        {error}
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="text-center mt-3 xs:mt-4 sm:mt-6 p-4">
        <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-purple-500/10 rounded-xl 
          flex items-center justify-center mx-auto mb-2 xs:mb-3 sm:mb-4">
          <Users className="text-purple-400 w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-white mb-1 xs:mb-2">
          No {tournamentType === 'team' ? 'Teams' : 'Participants'} Yet
        </h3>
        <p className="text-xs sm:text-sm text-gray-400">
          Be the first to {tournamentType === 'team' ? 'register your team' : 'join'}!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 xs:px-3 sm:px-4">
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 
        gap-2 xs:gap-3 sm:gap-4">
        {participants.map((item) => (
        <ParticipantOrTeamCard 
        key={`participant-${item.registration_id}`} 
        item={item}
      />
        
        ))}
      </div>
    </div>
  );
};

export default ParticipantCardGrid;