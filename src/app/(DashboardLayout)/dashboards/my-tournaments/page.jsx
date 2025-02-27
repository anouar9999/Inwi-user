'use client';
import React, { useState, useEffect } from 'react';
import { Search, SearchX } from 'lucide-react';
import TournamentCard from '../../TournamentCard';
import { ToastContainer } from 'react-toastify';

const ParticipantTournaments = ({ participantId }) => {
  const [filters, setFilters] = useState({
    format_des_qualifications: '',
    status: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Add state for userId

  useEffect(() => {
    // Access localStorage only after component mounts (client-side)
    const user_id = localStorage.getItem("userId");
    setUserId(user_id);
    
    if (user_id) {
      setIsLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/my-tournament.php?user_id=${user_id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setTournaments(data.tournaments);
            setFilteredTournaments([data.tournaments]);
          } else {
            setError(data.message || 'Échec de la récupération des tournois du participant');
          }
        })
        .catch((error) => {
          console.error('Erreur:', error);
          setError('Une erreur est survenue lors de la récupération des tournois du participant');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [participantId]);

  const filterOptions = {
    format_des_qualifications: [
      { value: '', label: 'Format' },
      { value: 'Single Elimination', label: 'Single Elimination' },
      // Add other formats if needed
    ],
    status: [
      { value: '', label: 'Statut' },
      { value: 'Ouvert aux inscriptions', label: 'Ouvert aux inscriptions' },
      { value: 'En cours', label: 'En cours' },
      { value: 'Terminé', label: 'Terminé' },
    ],
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white p-8   rounded-lg">
      <ToastContainer />

      <h3 className="text-5xl md:text-4xl lg:text-5xl tracking-wider mb-10 uppercase  font-custom">
        {' '}
        YOUR TOURNAMENT JOURNEY <br/><span className='text-primary' > FROM CHALLENGER TO CHAMPION  </span> 
      </h3>

      {tournaments.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">
          <SearchX className="mx-auto  mb-4 w-16 h-16" />
          <p>Vous n avez participé à aucun tournoi correspondant à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          {tournaments.map((tournament) => (
         
              <TournamentCard
              tournament={tournament}
                key={tournament.id}
                id={tournament.id}
                name={tournament.nom_des_qualifications}
                startDate={tournament.start_date}
                endDate={tournament.end_date}
                status={tournament.status}
                description_des_qualifications={tournament.description_des_qualifications}
                maxParticipants={tournament.nombre_maximum}
                format_des_qualifications={tournament.format_des_qualifications}
                type_de_match={tournament.type_de_match}
                type_de_jeu={tournament.type_de_jeu}
                image={tournament.image}
                prizePool={tournament.prize_pool}
                slug={tournament.slug}
                spots_remaining= {tournament.spots_remaining}
                tournamentType={tournament.participation_type}
                registered_count={tournament.registered_count}
              />
            
           
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantTournaments;
