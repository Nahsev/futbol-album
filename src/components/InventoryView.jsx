import React, { useState } from 'react';
import { useAlbum } from '../context/AlbumContext';
import { PLAYERS, LEAGUES } from '../data/futbolData';
import { RARITIES } from '../data/rarities';
import { formatSerial } from '../data/serials';
import CardSticker from './CardSticker';
import { Search, Filter, Coins, Zap, Layers, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InventoryView() {
  const { cardInventory, gluedStickers, glueSticker, sellDuplicateCard, fuseCards, resetCollection, poolSize } = useAlbum();
  const [confirmReset, setConfirmReset] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState('ALL');
  const [selectedLeague, setSelectedLeague] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [fuseMessage, setFuseMessage] = useState(null);

  // Flatten all owned card instances into a list
  const allCardInstances = [];
  Object.keys(cardInventory).forEach(playerId => {
    const basePlayer = PLAYERS.find(p => p.id === playerId);
    if (!basePlayer) return;

    const cards = cardInventory[playerId] || [];
    cards.forEach(c => {
      allCardInstances.push({
        ...basePlayer,
        instanceId: c.instanceId,
        cardRarity: c.cardRarity,
        serial: c.serial,
        float: c.float
      });
    });
  });

  // Ordenar por número de serie (la #1 primero)
  allCardInstances.sort((a, b) => (a.serial ?? Infinity) - (b.serial ?? Infinity));

  // Filter instances
  const filteredCards = allCardInstances.filter(card => {
    const matchesRarity = selectedRarity === 'ALL' || card.cardRarity === selectedRarity;
    const matchesLeague = selectedLeague === 'ALL' || card.leagueId === selectedLeague;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRarity && matchesLeague && matchesSearch;
  });

  const handleFuse = async (playerId) => {
    const result = await fuseCards(playerId);
    if (result && !result.error) {
      const fromName = RARITIES[result.fusedRarity]?.name;
      const toName = RARITIES[result.upgradedRarity]?.name;
      setFuseMessage(`¡Fusión Exitosa! 3 cartas ${fromName} se convirtieron en 1 carta ${toName} (${formatSerial(result.serial)}).`);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => setFuseMessage(null), 4000);
    } else {
      setFuseMessage(result?.error || "Necesitás al menos 3 cartas del mismo rango de este jugador para fusionar.");
      setTimeout(() => setFuseMessage(null), 4000);
    }
  };

  return (
    <div className="inventory-container flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-gray-950/95 border-2 border-gray-800 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-4 top-3 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-900 border border-gray-800 focus:border-amber-500 text-xs text-white placeholder-gray-500 outline-none transition"
          />
        </div>

        {/* Card Rarity Tier Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedRarity('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer whitespace-nowrap ${
              selectedRarity === 'ALL' ? 'bg-amber-400 text-gray-950 shadow' : 'bg-gray-900 text-gray-400 border border-gray-800'
            }`}
          >
            Todas ({allCardInstances.length})
          </button>
          {Object.values(RARITIES).map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRarity(r.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                selectedRarity === r.id
                  ? 'bg-amber-400 text-gray-950 shadow font-black'
                  : 'bg-gray-900 text-gray-400 border border-gray-800'
              }`}
            >
              <span>{r.icon}</span>
              <span>{r.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fusion Notification Banner */}
      {fuseMessage && (
        <div className="bg-gradient-to-r from-purple-900/90 to-cyan-900/90 border border-cyan-400/50 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-lg animate-fade-in">
          <Zap size={18} className="text-cyan-400 animate-bounce" />
          <span>{fuseMessage}</span>
        </div>
      )}

      {/* Collection Cards Grid */}
      <div className="bg-gray-950/95 border-2 border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Layers className="text-cyan-400" size={20} /> Colección de Cartas ({filteredCards.length})
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono">{poolSize} cartas siguen en sobres</span>
            <button
              onClick={() => {
                if (confirmReset) { resetCollection(); setConfirmReset(false); }
                else { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 3000); }
              }}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                confirmReset ? 'bg-red-600 text-white border-red-400' : 'bg-gray-900 text-gray-400 border-gray-700 hover:text-red-300'
              }`}
            >
              {confirmReset ? '¿Seguro? Clic de nuevo' : 'Reiniciar colección'}
            </button>
          </div>
        </div>

        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
            {filteredCards.map((card, idx) => {
              const playerAllCards = cardInventory[card.id] || [];
              const isGlued = !!gluedStickers[card.id];
              const canFuse = playerAllCards.length >= 3;

              return (
                <div key={card.instanceId || idx} className="flex flex-col items-center gap-2">
                  <CardSticker
                    player={card}
                    isOwned={true}
                    isGlued={isGlued}
                    cardRarity={card.cardRarity}
                    serial={card.serial}
                    float={card.float}
                    variant="card"
                    onGlue={!isGlued ? () => glueSticker(card.id) : null}
                    onSell={() => sellDuplicateCard(card.id, card.instanceId)}
                    size="normal"
                  />

                  {/* Fusion Button if 3+ duplicates */}
                  {canFuse && (
                    <button
                      onClick={() => handleFuse(card.id)}
                      className="w-full py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-[9px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Zap size={10} />
                      <span>Fusionar (x3 Cartas)</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500 font-mono text-sm">
            No se encontraron cartas en la colección con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
}
