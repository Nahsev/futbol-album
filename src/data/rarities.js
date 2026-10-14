// Card Edition Rarity Tier Definitions (10 Tiers: Iron to Challenger)
// Applied to cards when drawn from booster packs!

export const RARITIES = {
  IRON: {
    id: 'IRON',
    tierIndex: 1,
    name: 'Hierro',
    color: 'from-gray-700 via-gray-600 to-gray-800',
    borderColor: 'border-gray-500',
    textColor: 'text-gray-300',
    badgeBg: 'bg-gray-700/90 text-gray-200 border border-gray-500',
    glow: 'shadow-gray-500/20',
    sellValue: 50,
    icon: '⚙️'
  },
  BRONZE: {
    id: 'BRONZE',
    tierIndex: 2,
    name: 'Bronce',
    color: 'from-amber-900 via-amber-700 to-yellow-950',
    borderColor: 'border-amber-600',
    textColor: 'text-amber-300',
    badgeBg: 'bg-amber-800/90 text-amber-200 border border-amber-500',
    glow: 'shadow-amber-600/30',
    sellValue: 100,
    icon: '🥉'
  },
  SILVER: {
    id: 'SILVER',
    tierIndex: 3,
    name: 'Plata',
    color: 'from-slate-400 via-slate-200 to-slate-500',
    borderColor: 'border-slate-300',
    textColor: 'text-slate-100',
    badgeBg: 'bg-slate-500/90 text-white border border-slate-300',
    glow: 'shadow-slate-300/40',
    sellValue: 200,
    icon: '🥈'
  },
  GOLD: {
    id: 'GOLD',
    tierIndex: 4,
    name: 'Oro',
    color: 'from-amber-400 via-yellow-300 to-amber-600',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-950 font-black',
    badgeBg: 'bg-amber-400 text-yellow-950 font-bold border border-yellow-200',
    glow: 'shadow-yellow-400/50',
    sellValue: 400,
    icon: '🥇'
  },
  PLATINUM: {
    id: 'PLATINUM',
    tierIndex: 5,
    name: 'Platino',
    color: 'from-cyan-400 via-teal-300 to-cyan-600',
    borderColor: 'border-cyan-300',
    textColor: 'text-cyan-200',
    badgeBg: 'bg-cyan-600/90 text-white border border-cyan-300',
    glow: 'shadow-cyan-400/60',
    sellValue: 800,
    icon: '💿'
  },
  EMERALD: {
    id: 'EMERALD',
    tierIndex: 6,
    name: 'Esmeralda',
    color: 'from-emerald-500 via-teal-400 to-green-700',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-300',
    badgeBg: 'bg-emerald-600/90 text-white border border-emerald-300',
    glow: 'shadow-emerald-500/70',
    sellValue: 1500,
    icon: '🟢'
  },
  DIAMOND: {
    id: 'DIAMOND',
    tierIndex: 7,
    name: 'Diamante',
    color: 'from-blue-500 via-cyan-300 to-indigo-700',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-200',
    badgeBg: 'bg-blue-600/90 text-white border border-blue-300',
    glow: 'shadow-blue-500/80 ring-2 ring-cyan-300',
    sellValue: 3000,
    icon: '🔷'
  },
  MASTER: {
    id: 'MASTER',
    tierIndex: 8,
    name: 'Maestro',
    color: 'from-purple-600 via-fuchsia-500 to-indigo-800',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-200',
    badgeBg: 'bg-purple-600/90 text-white border border-purple-300 font-bold',
    glow: 'shadow-purple-500/90 ring-2 ring-purple-400',
    sellValue: 6000,
    icon: '🟣'
  },
  GRANDMASTER: {
    id: 'GRANDMASTER',
    tierIndex: 9,
    name: 'Gran Maestro',
    color: 'from-red-600 via-rose-500 to-amber-600',
    borderColor: 'border-red-400',
    textColor: 'text-red-200',
    badgeBg: 'bg-red-600 text-white font-bold border border-red-300',
    glow: 'shadow-red-500/95 ring-2 ring-red-500 animate-pulse',
    sellValue: 12000,
    icon: '🔴'
  },
  CHALLENGER: {
    id: 'CHALLENGER',
    tierIndex: 10,
    name: 'Challenger',
    color: 'from-cyan-400 via-yellow-300 to-pink-500',
    borderColor: 'border-cyan-300',
    textColor: 'text-yellow-300 font-black',
    badgeBg: 'bg-gradient-to-r from-amber-400 to-cyan-400 text-gray-950 font-black border border-yellow-200',
    glow: 'shadow-cyan-400/100 ring-4 ring-yellow-400 animate-bounce',
    sellValue: 25000,
    icon: '⚡'
  }
};
