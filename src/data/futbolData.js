// Leagues, Clubs, and Players Dataset for Soccer Album
// Note: Base players are standard album figures (without fixed rarity).
// Card editions/tiers are rolled dynamically when opening booster packs!

export const LEAGUES = [
  { id: 'premier', name: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra', badge: '🦁', color: 'from-purple-900 to-indigo-900' },
  { id: 'laliga', name: 'La Liga EA Sports', country: '🇪🇸 España', badge: '🇪🇸', color: 'from-red-900 to-amber-900' },
  { id: 'seriea', name: 'Serie A Made in Italy', country: '🇮🇹 Italia', badge: '🇮🇹', color: 'from-blue-900 to-cyan-900' },
  { id: 'bundesliga', name: 'Bundesliga', country: '🇩🇪 Alemania', badge: '🦅', color: 'from-red-950 to-gray-900' },
  { id: 'ligue1', name: 'Ligue 1 McDonald\'s', country: '🇫🇷 Francia', badge: '🇫🇷', color: 'from-cyan-950 to-blue-950' },
  { id: 'lfp', name: 'Liga Profesional Argentina', country: '🇦🇷 Argentina', badge: '🏆', color: 'from-sky-900 to-indigo-950' }
];

export const CLUBS = [
  // Premier League
  { id: 'mcfc', name: 'Manchester City', leagueId: 'premier', badge: '🩵', primaryColor: '#6CABDD' },
  { id: 'afc', name: 'Arsenal FC', leagueId: 'premier', badge: '🔴', primaryColor: '#EF0107' },
  { id: 'lfc', name: 'Liverpool FC', leagueId: 'premier', badge: '🔴', primaryColor: '#C8102E' },
  { id: 'mufc', name: 'Manchester United', leagueId: 'premier', badge: '👹', primaryColor: '#DA291C' },

  // La Liga
  { id: 'rmcf', name: 'Real Madrid CF', leagueId: 'laliga', badge: '👑', primaryColor: '#FEBE10' },
  { id: 'fcb', name: 'FC Barcelona', leagueId: 'laliga', badge: '🔵🔴', primaryColor: '#004D98' },
  { id: 'atm', name: 'Atlético de Madrid', leagueId: 'laliga', badge: '🔴⚪', primaryColor: '#CB3524' },

  // Serie A
  { id: 'inter', name: 'Inter de Milán', leagueId: 'seriea', badge: '⚫🔵', primaryColor: '#0053A0' },
  { id: 'acm', name: 'AC Milan', leagueId: 'seriea', badge: '🔴⚫', primaryColor: '#FB090B' },
  { id: 'juve', name: 'Juventus FC', leagueId: 'seriea', badge: '⚪⚫', primaryColor: '#000000' },

  // Bundesliga
  { id: 'bayern', name: 'Bayern Múnich', leagueId: 'bundesliga', badge: '🔴⚪', primaryColor: '#DC052D' },
  { id: 'bvb', name: 'Borussia Dortmund', leagueId: 'bundesliga', badge: '🟡⚫', primaryColor: '#FDE100' },
  { id: 'bayer', name: 'Bayer Leverkusen', leagueId: 'bundesliga', badge: '🔴⚫', primaryColor: '#E32219' },

  // Ligue 1
  { id: 'psg', name: 'Paris Saint-Germain', leagueId: 'ligue1', badge: '🔵🔴', primaryColor: '#004170' },

  // Liga Argentina
  { id: 'boca', name: 'Boca Juniors', leagueId: 'lfp', badge: '🟦🟨', primaryColor: '#00457C' },
  { id: 'river', name: 'River Plate', leagueId: 'lfp', badge: '⚪🔴', primaryColor: '#EB1C24' },
  { id: 'racing', name: 'Racing Club', leagueId: 'lfp', badge: '🩵⚪', primaryColor: '#0085C9' }
];

export const PLAYERS = [
  // Inter Miami / Special Icons
  {
    id: 'p-messi',
    slotNumber: 1,
    name: 'Lionel Messi',
    clubId: 'inter',
    leagueId: 'lfp',
    position: 'RW',
    rating: 99,
    nationality: '🇦🇷 Argentina',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 95, SHO: 98, PAS: 99, DRI: 99, DEF: 45, PHY: 78 }
  },

  // Real Madrid CF
  {
    id: 'p-cr7',
    slotNumber: 1,
    name: 'Cristiano Ronaldo',
    clubId: 'rmcf',
    leagueId: 'laliga',
    position: 'ST',
    rating: 99,
    nationality: '🇵🇹 Portugal',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 96, SHO: 99, PAS: 88, DRI: 94, DEF: 42, PHY: 92 }
  },
  {
    id: 'p-mbappe',
    slotNumber: 2,
    name: 'Kylian Mbappé',
    clubId: 'rmcf',
    leagueId: 'laliga',
    position: 'ST',
    rating: 98,
    nationality: '🇫🇷 Francia',
    image: 'https://images.unsplash.com/photo-1543351611-c82399575a40?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 99, SHO: 95, PAS: 85, DRI: 96, DEF: 39, PHY: 82 }
  },
  {
    id: 'p-vinicius',
    slotNumber: 3,
    name: 'Vinícius Jr',
    clubId: 'rmcf',
    leagueId: 'laliga',
    position: 'LW',
    rating: 97,
    nationality: '🇧🇷 Brasil',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 98, SHO: 91, PAS: 86, DRI: 97, DEF: 35, PHY: 76 }
  },
  {
    id: 'p-bellingham',
    slotNumber: 4,
    name: 'Jude Bellingham',
    clubId: 'rmcf',
    leagueId: 'laliga',
    position: 'CAM',
    rating: 95,
    nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 86, SHO: 90, PAS: 91, DRI: 92, DEF: 82, PHY: 88 }
  },
  {
    id: 'p-valverde',
    slotNumber: 5,
    name: 'Federico Valverde',
    clubId: 'rmcf',
    leagueId: 'laliga',
    position: 'CM',
    rating: 89,
    nationality: '🇺🇾 Uruguay',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 89, SHO: 86, PAS: 87, DRI: 85, DEF: 82, PHY: 87 }
  },

  // Manchester City
  {
    id: 'p-haaland',
    slotNumber: 1,
    name: 'Erling Haaland',
    clubId: 'mcfc',
    leagueId: 'premier',
    position: 'ST',
    rating: 98,
    nationality: '🇳🇴 Noruega',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 95, SHO: 97, PAS: 78, DRI: 85, DEF: 45, PHY: 93 }
  },
  {
    id: 'p-rodri',
    slotNumber: 2,
    name: 'Rodri Hernández',
    clubId: 'mcfc',
    leagueId: 'premier',
    position: 'CDM',
    rating: 96,
    nationality: '🇪🇸 España',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 78, SHO: 85, PAS: 94, DRI: 88, DEF: 93, PHY: 91 }
  },
  {
    id: 'p-debruyne',
    slotNumber: 3,
    name: 'Kevin De Bruyne',
    clubId: 'mcfc',
    leagueId: 'premier',
    position: 'CM',
    rating: 95,
    nationality: '🇧🇪 Bélgica',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 75, SHO: 89, PAS: 98, DRI: 89, DEF: 70, PHY: 78 }
  },

  // FC Barcelona
  {
    id: 'p-yamal',
    slotNumber: 1,
    name: 'Lamine Yamal',
    clubId: 'fcb',
    leagueId: 'laliga',
    position: 'RW',
    rating: 95,
    nationality: '🇪🇸 España',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 94, SHO: 87, PAS: 91, DRI: 96, DEF: 38, PHY: 70 }
  },
  {
    id: 'p-pedri',
    slotNumber: 2,
    name: 'Pedri González',
    clubId: 'fcb',
    leagueId: 'laliga',
    position: 'CM',
    rating: 91,
    nationality: '🇪🇸 España',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 82, SHO: 79, PAS: 93, DRI: 93, DEF: 72, PHY: 73 }
  },

  // Bayern Munich & Bayer Leverkusen
  {
    id: 'p-kane',
    slotNumber: 1,
    name: 'Harry Kane',
    clubId: 'bayern',
    leagueId: 'bundesliga',
    position: 'ST',
    rating: 94,
    nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 74, SHO: 96, PAS: 89, DRI: 84, DEF: 49, PHY: 84 }
  },
  {
    id: 'p-musiala',
    slotNumber: 2,
    name: 'Jamal Musiala',
    clubId: 'bayern',
    leagueId: 'bundesliga',
    position: 'CAM',
    rating: 91,
    nationality: '🇩🇪 Alemania',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 89, SHO: 84, PAS: 87, DRI: 94, DEF: 45, PHY: 72 }
  },
  {
    id: 'p-wirtz',
    slotNumber: 1,
    name: 'Florian Wirtz',
    clubId: 'bayer',
    leagueId: 'bundesliga',
    position: 'CAM',
    rating: 90,
    nationality: '🇩🇪 Alemania',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 85, SHO: 85, PAS: 91, DRI: 92, DEF: 58, PHY: 70 }
  },

  // Inter Milan
  {
    id: 'p-lautaro',
    slotNumber: 2,
    name: 'Lautaro Martínez',
    clubId: 'inter',
    leagueId: 'seriea',
    position: 'ST',
    rating: 93,
    nationality: '🇦🇷 Argentina',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 87, SHO: 92, PAS: 80, DRI: 88, DEF: 52, PHY: 89 }
  },

  // Liverpool & Arsenal & Man Utd
  {
    id: 'p-salah',
    slotNumber: 1,
    name: 'Mohamed Salah',
    clubId: 'lfc',
    leagueId: 'premier',
    position: 'RW',
    rating: 93,
    nationality: '🇪🇬 Egipto',
    image: 'https://images.unsplash.com/photo-1543351611-c82399575a40?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 91, SHO: 92, PAS: 84, DRI: 90, DEF: 45, PHY: 78 }
  },
  {
    id: 'p-saka',
    slotNumber: 1,
    name: 'Bukayo Saka',
    clubId: 'afc',
    leagueId: 'premier',
    position: 'RW',
    rating: 92,
    nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 90, SHO: 87, PAS: 88, DRI: 91, DEF: 65, PHY: 77 }
  },
  {
    id: 'p-bruno',
    slotNumber: 1,
    name: 'Bruno Fernandes',
    clubId: 'mufc',
    leagueId: 'premier',
    position: 'CAM',
    rating: 88,
    nationality: '🇵🇹 Portugal',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 76, SHO: 87, PAS: 91, DRI: 84, DEF: 69, PHY: 77 }
  },

  // Boca Juniors
  {
    id: 'p-cavani',
    slotNumber: 1,
    name: 'Edinson Cavani',
    clubId: 'boca',
    leagueId: 'lfp',
    position: 'ST',
    rating: 86,
    nationality: '🇺🇾 Uruguay',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 78, SHO: 88, PAS: 74, DRI: 81, DEF: 55, PHY: 83 }
  },
  {
    id: 'p-zenon',
    slotNumber: 2,
    name: 'Kevin Zenón',
    clubId: 'boca',
    leagueId: 'lfp',
    position: 'LM',
    rating: 80,
    nationality: '🇦🇷 Argentina',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 86, SHO: 78, PAS: 80, DRI: 82, DEF: 62, PHY: 75 }
  },
  {
    id: 'p-diollo',
    slotNumber: 3,
    name: 'Mateo Diollo',
    clubId: 'boca',
    leagueId: 'lfp',
    position: 'CB',
    rating: 73,
    nationality: '🇦🇷 Argentina',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 68, SHO: 45, PAS: 62, DRI: 65, DEF: 74, PHY: 76 }
  },

  // River Plate
  {
    id: 'p-borja',
    slotNumber: 1,
    name: 'Miguel Borja',
    clubId: 'river',
    leagueId: 'lfp',
    position: 'ST',
    rating: 85,
    nationality: '🇨🇴 Colombia',
    image: 'https://images.unsplash.com/photo-1543351611-c82399575a40?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 82, SHO: 86, PAS: 70, DRI: 79, DEF: 40, PHY: 85 }
  },
  {
    id: 'p-mastantuono',
    slotNumber: 2,
    name: 'Franco Mastantuono',
    clubId: 'river',
    leagueId: 'lfp',
    position: 'CAM',
    rating: 78,
    nationality: '🇦🇷 Argentina',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 84, SHO: 76, PAS: 79, DRI: 83, DEF: 50, PHY: 71 }
  },

  // Racing Club
  {
    id: 'p-quintero',
    slotNumber: 1,
    name: 'Juan Fernando Quintero',
    clubId: 'racing',
    leagueId: 'lfp',
    position: 'CAM',
    rating: 82,
    nationality: '🇨🇴 Colombia',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&auto=format&fit=crop&q=80',
    stats: { PAC: 72, SHO: 83, PAS: 89, DRI: 86, DEF: 42, PHY: 68 }
  }
];
