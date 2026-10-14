import React from 'react';
import { RARITIES } from '../data/rarities';
import { TOTAL_SUPPLY, SERIAL_RANGES, formatSerial, formatFloat } from '../data/serials';
import { Check, Lock, Plus, Coins } from 'lucide-react';

export default function CardSticker({
  player,
  isOwned = false,
  isGlued = false,
  count = 0,
  cardRarity = 'IRON',
  serial = null,
  float = null,
  variant = 'sticker', // 'sticker' (Album mode) or 'card' (Pack/Inventory mode)
  onGlue = null,
  onSell = null,
  showStats = true,
  size = 'normal'
}) {
  if (!player) return null;

  const rarityInfo = RARITIES[cardRarity] || RARITIES.IRON;
  const isChallenger = cardRarity === 'CHALLENGER';
  const isGrandmaster = cardRarity === 'GRANDMASTER';
  const tierRange = SERIAL_RANGES[cardRarity];
  const hasSerial = typeof serial === 'number';

  const sizeClasses = size === 'small' 
    ? 'w-36 h-54 text-[10px]' 
    : size === 'large' 
      ? 'w-56 h-84 text-sm' 
      : 'w-44 h-66 text-xs';

  // -------------------------------------------------------------
  // UNOWNED / EMPTY ALBUM SLOT VIEW
  // -------------------------------------------------------------
  if (!isOwned && !isGlued) {
    return (
      <div className={`${sizeClasses} rounded-2xl bg-gray-900/60 border-2 border-dashed border-gray-800 flex flex-col items-center justify-between p-3 text-center opacity-70 hover:border-amber-500/40 hover:opacity-100 transition-all group relative overflow-hidden shadow-inner`}>
        {/* Slot Header */}
        <div className="w-full flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-950/80 px-2 py-0.5 rounded border border-gray-800">
            #{player.slotNumber ? String(player.slotNumber).padStart(2, '0') : '01'}
          </span>
          <span className="text-[9px] font-bold text-gray-500 uppercase">{player.position}</span>
        </div>

        {/* Lock Icon Placeholder */}
        <div className="my-auto flex flex-col items-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-gray-950/90 border border-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow">
            <Lock size={16} className="text-gray-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <span className="font-extrabold text-gray-400 font-sans tracking-wide truncate max-w-[120px]">
            {player.name}
          </span>
          <span className="text-[9px] font-mono text-gray-500">
            OVR {player.rating}
          </span>
        </div>

        {/* Footer info */}
        <div className="w-full pt-1 border-t border-gray-800/60 text-[9px] text-gray-600 font-mono">
          En sobre o mercado
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ALBUM STICKER VARIANT (Clean Panini-Style Figurine in Album)
  // -------------------------------------------------------------
  if (variant === 'sticker') {
    return (
      <div
        className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-b from-gray-900 via-gray-950 to-slate-950 border-2 ${
          isGlued ? 'border-emerald-500/80 shadow-lg shadow-emerald-500/20' : 'border-amber-400/80 shadow-lg shadow-amber-400/20'
        } p-2.5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:scale-105 select-none`}
      >
        {/* Shiny Silver/Gold Header Strip */}
        <div className="flex items-center justify-between z-10">
          <span className="font-mono font-black text-amber-400 text-[11px] bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
            #{player.slotNumber ? String(player.slotNumber).padStart(2, '0') : '01'}
          </span>
          
          <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-white/10">
            <span className="font-black text-yellow-400 text-xs font-mono">{player.rating}</span>
            <span className="font-bold text-[9px] text-gray-300">{player.position}</span>
          </div>
        </div>

        {/* Photo Container */}
        <div className="relative my-1 flex-1 flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gray-900/60">
          <img
            src={player.image}
            alt={player.name}
            className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
          />
          {/* Nationality Badge */}
          <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-white backdrop-blur">
            {player.nationality}
          </div>
        </div>

        {/* Player Name */}
        <div className="text-center z-10 mb-1">
          <div className="font-black text-white truncate text-xs drop-shadow-md">{player.name}</div>
          {hasSerial && (
            <div className="font-mono text-[8px] text-gray-400 mt-0.5">
              <span className={rarityInfo.textColor}>{formatSerial(serial)}</span>
              {float !== null && <span> · {formatFloat(float)}</span>}
            </div>
          )}
        </div>

        {/* Card Rarity Badge & Glued Indicator */}
        <div className="flex items-center justify-between text-[9px] z-10 pt-1 border-t border-gray-800">
          {/* Rarity Tier drawn tag */}
          <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${rarityInfo.badgeBg} flex items-center gap-1 text-[8px]`}>
            <span>{rarityInfo.icon}</span>
            <span>{rarityInfo.name}</span>
          </span>

          {isGlued ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-gray-950 font-black text-[9px] flex items-center gap-1 shadow">
              <Check size={10} strokeWidth={3} />
              <span>PEGADA</span>
            </span>
          ) : onGlue ? (
            <button
              onClick={onGlue}
              className="px-2.5 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-[9px] flex items-center gap-1 shadow cursor-pointer transition"
            >
              <Plus size={10} strokeWidth={3} />
              <span>PEGAR</span>
            </button>
          ) : null}
        </div>

        {/* Duplicate Count Tag */}
        {count > 1 && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-gray-950 font-black text-[9px] shadow-lg z-20">
            x{count}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // CARD EDITION VARIANT (Revealed from Pack or in Inventory)
  // -------------------------------------------------------------
  return (
    <div
      className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-b ${rarityInfo.color} border-2 ${rarityInfo.borderColor} ${rarityInfo.glow} shadow-2xl p-3 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:scale-105 select-none ${
        isChallenger ? 'animate-hologram ring-4 ring-yellow-400/90' : isGrandmaster ? 'ring-2 ring-red-500' : ''
      }`}
    >
      {/* Background Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-white/0 opacity-40 pointer-events-none" />

      {/* Top Bar: Rating, Position & Rarity Tag */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 bg-gray-950/80 px-2 py-0.5 rounded-lg border border-gray-800">
          <span className="font-black text-sm text-yellow-400 font-mono">{player.rating}</span>
          <span className="font-bold text-[10px] text-gray-300">{player.position}</span>
        </div>

        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${rarityInfo.badgeBg} flex items-center gap-1 shadow-md`}>
          <span>{rarityInfo.icon}</span>
          <span>{rarityInfo.name}</span>
        </span>
      </div>

      {/* Player Photo */}
      <div className="relative my-1 flex-1 flex items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-gray-950/50">
        <img
          src={player.image}
          alt={player.name}
          className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">
          {player.nationality}
        </div>
      </div>

      {/* Player Name */}
      <div className="text-center z-10 mb-1">
        <div className="font-black text-white truncate text-sm drop-shadow-md">{player.name}</div>
      </div>

      {/* Serial number & float */}
      {hasSerial && (
        <div className="flex items-center justify-between gap-1 bg-black/75 px-2 py-1 rounded-lg border border-white/15 font-mono text-[9px] z-10 mb-1">
          <span className="text-white font-black" title={`Edición limitada: ${tierRange?.supply} copia(s) de este rango`}>
            {formatSerial(serial)}<span className="text-gray-500 font-normal">/{TOTAL_SUPPLY}</span>
          </span>
          {float !== null && (
            <span className="text-cyan-300" title="Float: más bajo = mejor">
              FL {formatFloat(float)}
            </span>
          )}
        </div>
      )}

      {/* Stats Grid */}
      {showStats && player.stats && (
        <div className="grid grid-cols-3 gap-1 bg-gray-950/85 p-1.5 rounded-lg border border-gray-800 text-[9px] font-mono z-10">
          <div className="text-center">
            <span className="text-gray-400">PAC</span> <strong className="text-white">{player.stats.PAC}</strong>
          </div>
          <div className="text-center">
            <span className="text-gray-400">SHO</span> <strong className="text-white">{player.stats.SHO}</strong>
          </div>
          <div className="text-center">
            <span className="text-gray-400">PAS</span> <strong className="text-white">{player.stats.PAS}</strong>
          </div>
          <div className="text-center">
            <span className="text-gray-400">DRI</span> <strong className="text-white">{player.stats.DRI}</strong>
          </div>
          <div className="text-center">
            <span className="text-gray-400">DEF</span> <strong className="text-white">{player.stats.DEF}</strong>
          </div>
          <div className="text-center">
            <span className="text-gray-400">PHY</span> <strong className="text-white">{player.stats.PHY}</strong>
          </div>
        </div>
      )}

      {/* Glued Indicator & Duplicate Count */}
      <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-20">
        {isGlued && (
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-gray-950 font-bold flex items-center justify-center text-xs shadow-lg shadow-emerald-500/50" title="Figurita Pegada en Álbum">
            <Check size={12} strokeWidth={3} />
          </span>
        )}
        {count > 1 && (
          <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-gray-950 font-black text-[9px] shadow">
            x{count}
          </span>
        )}
      </div>

      {/* Buttons: Sell or Glue */}
      <div className="mt-1 flex items-center gap-1 z-20">
        {!isGlued && isOwned && onGlue && (
          <button
            onClick={onGlue}
            className="flex-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-lg cursor-pointer transition"
          >
            <Plus size={11} />
            <span>Pegar</span>
          </button>
        )}
        {onSell && (
          <button
            onClick={onSell}
            className="py-1 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-bold text-[10px] flex items-center justify-center gap-1 border border-amber-500/40 cursor-pointer transition"
            title={`Vender por ${rarityInfo.sellValue} monedas`}
          >
            <Coins size={11} />
            <span>+{rarityInfo.sellValue}</span>
          </button>
        )}
      </div>
    </div>
  );
}
