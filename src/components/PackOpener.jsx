import React, { useState } from 'react';
import { useAlbum } from '../context/AlbumContext';
import { RARITIES } from '../data/rarities';
import { SERIAL_RANGES, TOTAL_SUPPLY, TIER_ORDER, formatSerial } from '../data/serials';
import CardSticker from './CardSticker';
import { Package, Sparkles, Coins, Gem, Eye, CheckCircle2, RotateCcw, HelpCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PackOpener() {
  const { openBoosterPack, coins, gems, glueSticker, gluedStickers, sellDuplicateCard, poolSize, poolCounts } = useAlbum();
  const [openingPack, setOpeningPack] = useState(false);
  const [revealedCards, setRevealedCards] = useState(null);
  const [flippedMap, setFlippedMap] = useState({});
  const [showOddsModal, setShowOddsModal] = useState(false);

  const packsCatalog = [
    {
      id: 'BRONZE',
      name: 'Sobre Bronce Colección',
      cost: 100,
      isGems: false,
      color: 'from-amber-900 via-amber-800 to-gray-950 border-amber-600',
      badge: '🤎',
      description: 'Contiene 5 cartas al azar. Ideal para iniciar tu colección (Hierro, Bronce, Plata).'
    },
    {
      id: 'SILVER',
      name: 'Sobre Plata Especial',
      cost: 250,
      isGems: false,
      color: 'from-slate-700 via-slate-800 to-gray-950 border-slate-400',
      badge: '🥈',
      description: 'Mejores tasas de tirada de cartas Plata, Oro y Platino.'
    },
    {
      id: 'GOLD',
      name: 'Sobre Oro Premium',
      cost: 500,
      isGems: false,
      color: 'from-amber-500 via-yellow-600 to-amber-900 border-yellow-300',
      badge: '🥇',
      description: 'Gran probabilidad de cartas Oro, Platino, Esmeralda y Diamante.'
    },
    {
      id: 'CHALLENGER',
      name: 'Sobre Challenger Mítico',
      cost: 20,
      isGems: true,
      color: 'from-cyan-500 via-purple-600 to-pink-600 border-cyan-300',
      badge: '⚡',
      description: '¡Sobre exclusivo de máximo rango! Garantiza cartas Esmeralda, Diamante, Maestro y Challenger.'
    }
  ];

  const handleOpenPack = (pack) => {
    setOpeningPack(true);
    setRevealedCards(null);
    setFlippedMap({});

    setTimeout(async () => {
      const drawn = await openBoosterPack(pack.id);
      if (drawn) {
        setRevealedCards(drawn);
        
        // Trigger celebratory confetti if any high tier card was drawn
        const hasLegendary = drawn.some(c => ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(c.cardRarity));
        confetti({
          particleCount: hasLegendary ? 120 : 60,
          spread: hasLegendary ? 90 : 60,
          origin: { y: 0.6 }
        });
      }
      setOpeningPack(false);
    }, 1200);
  };

  const handleFlipCard = (idx) => {
    setFlippedMap(prev => ({ ...prev, [idx]: true }));
  };

  const handleRevealAll = () => {
    if (!revealedCards) return;
    const allFlipped = {};
    revealedCards.forEach((_, idx) => {
      allFlipped[idx] = true;
    });
    setFlippedMap(allFlipped);
  };

  return (
    <div className="pack-opener-container flex flex-col gap-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20 mb-3">
          <Sparkles size={14} className="text-amber-400" /> Tienda Oficial de Sobres de Cartas
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Abre Sobres y Desbloquea Ránquines de Carta
        </h2>
        <p className="text-xs text-gray-400 mt-2">
          Cada sobre incluye 5 cartas con rarezas y acabados asignados al momento de abrir (Hierro a Challenger ⚡).
        </p>

        <button
          onClick={() => setShowOddsModal(true)}
          className="mt-3 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
        >
          <HelpCircle size={13} />
          <span>Ver tirada limitada ({poolSize}/{TOTAL_SUPPLY} cartas en sobres)</span>
        </button>
      </div>

      {/* Opening Animation Loader */}
      {openingPack && (
        <div className="bg-gray-950/90 border-2 border-amber-500/40 rounded-3xl p-12 text-center shadow-2xl flex flex-col items-center justify-center animate-pulse backdrop-blur-xl">
          <div className="w-28 h-36 rounded-2xl bg-gradient-to-tr from-purple-600 via-amber-500 to-pink-600 border-2 border-yellow-300 flex items-center justify-center text-5xl shadow-2xl animate-bounce mb-4">
            📦
          </div>
          <h3 className="text-2xl font-black text-white">¡Abriendo Sobre de Cartas!</h3>
          <p className="text-xs text-gray-400 mt-1 font-mono">Mezclando plantilla y asignando ediciones de rareza...</p>
        </div>
      )}

      {/* Revealed Cards Display Screen */}
      {revealedCards && !openingPack && (
        <div className="bg-gray-950/95 border-2 border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-2xl animate-fade-in flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles className="text-amber-400" size={20} /> ¡Cartas Obtenidas en el Sobre!
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Haz clic en cada carta para revelar su edición y rareza de tirada.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRevealAll}
                className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Eye size={15} />
                <span>Revelar Todas</span>
              </button>

              <button
                onClick={() => setRevealedCards(null)}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs transition cursor-pointer shadow-lg shadow-amber-400/20"
              >
                Guardar en Colección
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
            {revealedCards.map((card, idx) => {
              const isFlipped = !!flippedMap[idx];
              const isGlued = !!gluedStickers[card.id];

              return (
                <div key={card.instanceId || idx} className="flex flex-col items-center gap-2">
                  {!isFlipped ? (
                    /* Face Down Card Back */
                    <div
                      onClick={() => handleFlipCard(idx)}
                      className="w-44 h-66 rounded-2xl bg-gradient-to-tr from-gray-900 via-indigo-950 to-gray-950 border-2 border-amber-500/50 p-4 flex flex-col items-center justify-center text-center cursor-pointer shadow-xl hover:scale-105 transition-transform group"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Sparkles size={20} className="text-amber-400 animate-spin" />
                      </div>
                      <span className="text-xs font-black text-white tracking-wider uppercase">VER CARTA</span>
                      <span className="text-[10px] text-amber-400 font-mono mt-1">Haz Clic</span>
                    </div>
                  ) : (
                    /* Revealed Face Up Card */
                    <div className="animate-card-flip flex flex-col items-center gap-2">
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Packs Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packsCatalog.map(pack => {
          const canAfford = (pack.isGems ? gems >= pack.cost : coins >= pack.cost) && poolSize > 0;

          return (
            <div
              key={pack.id}
              className={`rounded-3xl bg-gradient-to-b ${pack.color} border-2 p-6 flex flex-col justify-between shadow-2xl transition hover:scale-105 relative overflow-hidden group`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{pack.badge}</span>
                  <span className="px-3 py-1 bg-black/70 rounded-full font-mono font-bold text-xs text-white border border-white/10 shadow">
                    5 Cartas
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mb-2">{pack.name}</h3>
                <p className="text-xs text-gray-300 mb-6 leading-relaxed">{pack.description}</p>
              </div>

              <button
                onClick={() => handleOpenPack(pack)}
                disabled={!canAfford || openingPack}
                className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                  canAfford
                    ? 'bg-amber-400 hover:bg-amber-300 text-gray-950 shadow-amber-400/40'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                }`}
              >
                <span>Abrir por {pack.cost}</span>
                {pack.isGems ? <Gem size={16} className="text-cyan-950" /> : <Coins size={16} className="text-amber-950" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Odds Modal Popup */}
      {showOddsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-950 border-2 border-cyan-500/40 rounded-3xl p-6 max-w-lg w-full relative shadow-2xl flex flex-col gap-4">
            <button
              onClick={() => setShowOddsModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="text-cyan-400" size={20} /> Tirada Limitada por Rango
            </h3>
            <p className="text-xs text-gray-400">
              Edición limitada de {TOTAL_SUPPLY} cartas numeradas: cada rango tiene el doble de copias que el anterior. Si el rango que te toca está agotado, la carta se vuelve a tirar. Los floats van de 0 a 1 al azar (más bajo = mejor). Vender una carta la devuelve a los sobres.
            </p>

            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
              {TIER_ORDER.map(id => {
                const r = RARITIES[id];
                const range = SERIAL_RANGES[id];
                const left = poolCounts[id];
                return (
                  <div key={r.id} className="flex items-center justify-between bg-gray-900/80 p-2.5 rounded-xl border border-gray-800 text-xs gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{r.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{r.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {range.start === range.end ? formatSerial(range.start) : `${formatSerial(range.start)} – ${formatSerial(range.end)}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-[11px] ${left === 0 ? 'text-red-400' : 'text-emerald-300'}`}>
                        {left === 0 ? 'AGOTADA' : `Quedan ${left}/${range.supply}`}
                      </span>
                      <span className="text-amber-300 font-mono text-[11px]">+{r.sellValue}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
