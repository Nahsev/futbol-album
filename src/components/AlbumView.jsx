import React, { useState, useEffect } from 'react';
import { LEAGUES, CLUBS as LOCAL_CLUBS, PLAYERS as LOCAL_PLAYERS } from '../data/futbolData';
import { fetchTeamsForLeague, fetchPlayersForTeam } from '../services/footballApi';
import { useAlbum } from '../context/AlbumContext';
import { RARITIES } from '../data/rarities';
import CardSticker from './CardSticker';
import { Trophy, Loader2, Sparkles, CheckCircle2, Radio, Info, X, Shield, Star, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AlbumView() {
  const [selectedLeagueId, setSelectedLeagueId] = useState('lfp');
  const [clubsList, setClubsList] = useState(LOCAL_CLUBS.filter(c => c.leagueId === 'lfp'));
  const [selectedClubId, setSelectedClubId] = useState('boca');
  const [playersList, setPlayersList] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [inspectedPlayer, setInspectedPlayer] = useState(null);

  const { cardInventory, gluedStickers, glueSticker, getBestCard } = useAlbum();

  // Load teams when league changes
  useEffect(() => {
    let isMounted = true;
    async function loadLeagueTeams() {
      setIsLoadingApi(true);
      const apiTeams = await fetchTeamsForLeague(selectedLeagueId, LOCAL_CLUBS);
      
      if (isMounted) {
        if (apiTeams && apiTeams.length > 0) {
          setClubsList(apiTeams);
          setSelectedClubId(apiTeams[0].id);
        } else {
          const localClubs = LOCAL_CLUBS.filter(c => c.leagueId === selectedLeagueId);
          setClubsList(localClubs);
          if (localClubs.length > 0) setSelectedClubId(localClubs[0].id);
        }
        setIsLoadingApi(false);
      }
    }

    loadLeagueTeams();
    return () => { isMounted = false; };
  }, [selectedLeagueId]);

  // Load players when club changes
  useEffect(() => {
    let isMounted = true;
    const currentClubObj = clubsList.find(c => c.id === selectedClubId);
    if (!currentClubObj) return;

    async function loadClubPlayers() {
      setIsLoadingApi(true);
      if (currentClubObj.rawTeamId) {
        const apiPlayers = await fetchPlayersForTeam(currentClubObj.rawTeamId, currentClubObj.name);
        if (isMounted) {
          if (apiPlayers && apiPlayers.length > 0) {
            setPlayersList(apiPlayers);
          } else {
            setPlayersList(LOCAL_PLAYERS.filter(p => p.clubId === currentClubObj.id));
          }
          setIsLoadingApi(false);
        }
      } else {
        if (isMounted) {
          setPlayersList(LOCAL_PLAYERS.filter(p => p.clubId === currentClubObj.id));
          setIsLoadingApi(false);
        }
      }
    }

    loadClubPlayers();
    return () => { isMounted = false; };
  }, [selectedClubId, clubsList]);

  const currentClub = clubsList.find(c => c.id === selectedClubId) || LOCAL_CLUBS[0];

  // Calculate team progress
  const teamGluedCount = playersList.filter(p => gluedStickers[p.id]).length;
  const teamTotalCount = playersList.length || 12;
  const teamPercent = Math.round((teamGluedCount / teamTotalCount) * 100);

  const handleGlue = async (playerId) => {
    const success = await glueSticker(playerId);
    if (success) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="album-view flex flex-col gap-6">
      {/* League Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-800 scrollbar-none">
        {LEAGUES.map(league => (
          <button
            key={league.id}
            onClick={() => setSelectedLeagueId(league.id)}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              selectedLeagueId === league.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 shadow-lg shadow-amber-500/25 scale-105 ring-2 ring-amber-300/40'
                : 'bg-gray-900/90 hover:bg-gray-800 text-gray-400 border border-gray-800'
            }`}
          >
            <span>{league.badge}</span>
            <span>{league.name}</span>
          </button>
        ))}
      </div>

      {/* Album Binder Book Frame */}
      <div className="album-binder bg-gray-950/95 border-2 border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        
        {/* Stadium Cover Background Image */}
        {currentClub?.teamPhoto && (
          <div className="absolute top-0 inset-x-0 h-40 opacity-20 overflow-hidden pointer-events-none">
            <img src={currentClub.teamPhoto} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/80 to-gray-950" />
          </div>
        )}

        {/* Club Header & Completion Widget */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-800/80 pb-6 mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border-2 border-gray-800 flex items-center justify-center text-3xl shadow-2xl overflow-hidden shrink-0">
              {currentClub?.badge?.startsWith('http') ? (
                <img src={currentClub.badge} alt={currentClub.name} className="w-12 h-12 object-contain" />
              ) : (
                <span>{currentClub?.badge || '⚽'}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-white tracking-tight">{currentClub?.name || 'Club'}</h2>
                <span className="text-xs font-mono font-bold text-amber-400 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                  {currentClub?.stadium ? `Estadio: ${currentClub.stadium}` : 'Panini Book Edition'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                <span>Página Oficial del Álbum</span> • 
                <span>Pegadas: <strong className="text-emerald-400">{teamGluedCount} de {teamTotalCount}</strong> ({teamPercent}%)</span>
              </p>
            </div>
          </div>

          {/* Club Roster Selector */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {clubsList.map(club => {
              const isSelected = club.id === selectedClubId;
              return (
                <button
                  key={club.id}
                  onClick={() => setSelectedClubId(club.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-400 text-gray-950 shadow-md shadow-amber-400/30 font-black'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
                  }`}
                >
                  {club.badge?.startsWith('http') ? (
                    <img src={club.badge} alt={club.name} className="w-4 h-4 object-contain" />
                  ) : (
                    <span>{club.badge}</span>
                  )}
                  <span>{club.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoadingApi && (
          <div className="py-20 text-center text-amber-400 font-mono text-sm flex items-center justify-center gap-3">
            <Loader2 size={24} className="animate-spin text-amber-400" />
            <span>Cargando figuritas del equipo...</span>
          </div>
        )}

        {/* Roster Sticker Slots Grid */}
        {!isLoadingApi && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative z-10">
            {playersList.map((player, idx) => {
              const cardsOwned = cardInventory[player.id] || [];
              const isGlued = !!gluedStickers[player.id];
              const isOwned = cardsOwned.length > 0 || isGlued;
              const bestCard = getBestCard(player.id);
              const bestRarity = bestCard?.cardRarity || 'IRON';

              return (
                <div key={player.id || idx} className="flex flex-col items-center">
                  <div
                    onClick={() => isOwned && setInspectedPlayer({ ...player, bestRarity, bestSerial: bestCard?.serial, bestFloat: bestCard?.float })}
                    className={isOwned ? "cursor-pointer" : ""}
                  >
                    <CardSticker
                      player={{ ...player, slotNumber: player.slotNumber || (idx + 1) }}
                      isOwned={isOwned}
                      isGlued={isGlued}
                      count={cardsOwned.length}
                      cardRarity={bestRarity}
                      serial={bestCard?.serial}
                      float={bestCard?.float ?? null}
                      variant="sticker"
                      onGlue={isOwned && !isGlued ? (e) => { e.stopPropagation(); handleGlue(player.id); } : null}
                      size="small"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoadingApi && playersList.length === 0 && (
          <div className="py-16 text-center text-gray-500 font-mono text-sm">
            No se encontraron jugadores disponibles para este club.
          </div>
        )}

      </div>

      {/* Inspect Sticker Modal Popup */}
      {inspectedPlayer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-950 border-2 border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl flex flex-col items-center gap-6">
            <button
              onClick={() => setInspectedPlayer(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-white text-center flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} /> Inspección de Figurita
            </h3>

            <CardSticker
              player={inspectedPlayer}
              isOwned={true}
              isGlued={!!gluedStickers[inspectedPlayer.id]}
              count={(cardInventory[inspectedPlayer.id] || []).length}
              cardRarity={inspectedPlayer.bestRarity || 'IRON'}
              serial={inspectedPlayer.bestSerial}
              float={inspectedPlayer.bestFloat ?? null}
              variant="card"
              size="normal"
            />

            <div className="w-full bg-gray-900/90 rounded-2xl p-4 border border-gray-800 text-xs text-gray-300 flex flex-col gap-2">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Edición de Carta Poseída:</span>
                <span className="font-bold text-amber-400 uppercase">{RARITIES[inspectedPlayer.bestRarity]?.name || 'Hierro'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Estado en Álbum:</span>
                <span className="font-bold text-emerald-400">{gluedStickers[inspectedPlayer.id] ? 'Pegada en página' : 'Guardada en Colección'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monedas al vender duplicados:</span>
                <span className="font-bold text-amber-300">+{RARITIES[inspectedPlayer.bestRarity]?.sellValue || 100}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
