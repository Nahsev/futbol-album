import React, { useState } from 'react';
import { useAlbum } from '../context/AlbumContext';
import { Trophy, BookOpen, Package, Layers, Coins, Gem, Gift, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Header({ activeTab, setActiveTab }) {
  const { coins, gems, progressPercent, gluedCount, totalPlayersCount, claimDailyReward } = useAlbum();
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    claimDailyReward();
    setClaimed(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.2 }
    });
    setTimeout(() => setClaimed(false), 3000);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-2xl border-b border-gray-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('album')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/30">
            <Trophy className="text-gray-950 font-black animate-pulse" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
              FUTBOL <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">ALBUM</span>
            </h1>
            <p className="text-[10px] text-amber-400/90 font-mono tracking-wider font-bold hidden sm:block mt-0.5">
              COLECCIÓN OFICIAL DE CROMOS
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 bg-gray-900/90 p-1.5 rounded-2xl border border-gray-800/80 shadow-inner">
          <button
            onClick={() => setActiveTab('album')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'album'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 shadow-lg shadow-amber-500/30 scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <BookOpen size={16} />
            <span className="hidden sm:inline">Álbum</span>
          </button>

          <button
            onClick={() => setActiveTab('packs')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'packs'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Package size={16} />
            <span className="hidden sm:inline">Sobres</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Layers size={16} />
            <span className="hidden sm:inline">Colección</span>
          </button>
        </div>

        {/* Progress & Balances */}
        <div className="flex items-center gap-2.5">
          {/* Progress Widget */}
          <div className="hidden lg:flex items-center gap-2 bg-gray-900/90 px-3 py-1.5 rounded-xl border border-gray-800 text-xs">
            <span className="text-gray-400 font-medium">Pegadas:</span>
            <div className="w-16 h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono font-bold text-emerald-400 text-[11px]">{gluedCount}/{totalPlayersCount}</span>
          </div>

          {/* Daily Coins Reward Button */}
          <button
            onClick={handleClaim}
            disabled={claimed}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              claimed
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 animate-pulse'
            }`}
            title="Reclamar regalo diario (+1,500 Monedas +25 Gemas)"
          >
            <Gift size={15} className={claimed ? "text-emerald-400" : "text-amber-400"} />
            <span className="hidden md:inline">{claimed ? '¡Reclamado!' : '+Regalo'}</span>
          </button>

          {/* Coins Balance */}
          <div className="flex items-center gap-1.5 bg-gray-900/90 px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs font-mono font-bold text-amber-300 shadow-md">
            <Coins size={16} className="text-amber-400" />
            <span>{coins.toLocaleString()}</span>
          </div>

          {/* Gems Balance */}
          <div className="flex items-center gap-1.5 bg-gray-900/90 px-3 py-1.5 rounded-xl border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 shadow-md">
            <Gem size={16} className="text-cyan-400" />
            <span>{gems}</span>
          </div>
        </div>

      </div>
    </header>
  );
}
