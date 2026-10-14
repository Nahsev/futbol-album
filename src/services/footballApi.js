// Real TheSports API Client for Football Teams & Player Photos
const THESPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

// League IDs in TheSports API
const LEAGUE_MAP = {
  premier: { id: '4328', name: 'English Premier League', defaultLogo: 'https://www.thesportsdb.com/images/media/league/badge/v49c661580146313.png' },
  laliga: { id: '4335', name: 'Spanish La Liga', defaultLogo: 'https://www.thesportsdb.com/images/media/league/badge/25o66k1688647895.png' },
  seriea: { id: '4332', name: 'Italian Serie A', defaultLogo: 'https://www.thesportsdb.com/images/media/league/badge/t06nfs1688647970.png' },
  bundesliga: { id: '4331', name: 'German Bundesliga', defaultLogo: 'https://www.thesportsdb.com/images/media/league/badge/eb6eor1688647935.png' },
  ligue1: { id: '4334', name: 'French Ligue 1', defaultLogo: 'https://www.thesportsdb.com/images/media/league/badge/8mvtik1688648011.png' },
  lfp: { id: '4351', name: 'Argentine Primera Division', defaultLogo: 'https://www.thesportsdb.com/images/media/league/badge/r1d8m91688648074.png' }
};

const apiCache = {};

// Default Player Cutouts by position fallback
const PLAYER_PHOTOS_POOL = [
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543351611-c82399575a40?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=400&auto=format&fit=crop&q=80'
];

export async function fetchTeamsForLeague(leagueKey) {
  if (apiCache[leagueKey]) return apiCache[leagueKey];

  const leagueInfo = LEAGUE_MAP[leagueKey] || LEAGUE_MAP.laliga;

  try {
    const url = `${THESPORTSDB_BASE}/lookup_all_teams.php?id=${leagueInfo.id}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("API network error");

    const data = await response.json();
    if (!data.teams || !data.teams.length) return null;

    const formattedTeams = data.teams.slice(0, 12).map(t => ({
      id: `team-${t.idTeam}`,
      name: t.strTeam,
      badge: t.strBadge || t.strLogo || t.strTeamBadge || leagueInfo.defaultLogo,
      teamPhoto: t.strFanart1 || t.strTeamFanart1 || t.strBadge || '',
      stadium: t.strStadium || '',
      established: t.intFormedYear || '1900',
      leagueId: leagueKey,
      rawTeamId: t.idTeam
    }));

    apiCache[leagueKey] = formattedTeams;
    return formattedTeams;
  } catch (err) {
    console.warn("TheSports API fetch teams error:", err);
    return null;
  }
}

export async function fetchPlayersForTeam(teamId, teamName) {
  const cacheKey = `players-${teamId}`;
  if (apiCache[cacheKey]) return apiCache[cacheKey];

  try {
    const url = `${THESPORTSDB_BASE}/lookup_all_players.php?id=${teamId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("API players network error");

    const data = await response.json();
    if (!data.player || !data.player.length) {
      return searchPlayersByTeamName(teamName);
    }

    const formattedPlayers = data.player.slice(0, 12).map((p, idx) => {
      const ovr = computePlayerRating(p);
      const photoUrl = p.strCutout || p.strRender || p.strThumb || PLAYER_PHOTOS_POOL[idx % PLAYER_PHOTOS_POOL.length];

      return {
        id: `api-p-${p.idPlayer}`,
        slotNumber: idx + 1,
        name: p.strPlayer,
        clubId: `team-${teamId}`,
        leagueId: p.strLeague ? mapLeagueNameToKey(p.strLeague) : 'laliga',
        position: p.strPosition || 'ST',
        rating: ovr,
        nationality: p.strNationality ? getFlagEmoji(p.strNationality) + ' ' + p.strNationality : '⚽ World',
        image: photoUrl,
        stats: {
          PAC: Math.min(99, ovr + (idx % 5) - 2),
          SHO: Math.min(99, ovr + (idx % 3) - 3),
          PAS: Math.min(99, ovr + (idx % 4) - 1),
          DRI: Math.min(99, ovr + (idx % 2)),
          DEF: Math.max(40, ovr - 20 + (idx % 6)),
          PHY: Math.min(99, ovr - 5 + (idx % 4))
        }
      };
    });

    apiCache[cacheKey] = formattedPlayers;
    return formattedPlayers;
  } catch (err) {
    console.warn("TheSports API fetch players error:", err);
    return null;
  }
}

async function searchPlayersByTeamName(teamName) {
  try {
    const url = `${THESPORTSDB_BASE}/searchplayers.php?t=${encodeURIComponent(teamName)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.player) return null;

    return data.player.slice(0, 12).map((p, idx) => {
      const ovr = computePlayerRating(p);
      const photoUrl = p.strCutout || p.strRender || p.strThumb || PLAYER_PHOTOS_POOL[idx % PLAYER_PHOTOS_POOL.length];

      return {
        id: `api-p-${p.idPlayer}`,
        slotNumber: idx + 1,
        name: p.strPlayer,
        position: p.strPosition || 'ST',
        rating: ovr,
        nationality: p.strNationality || '⚽ World',
        image: photoUrl,
        stats: { PAC: ovr, SHO: ovr - 2, PAS: ovr - 1, DRI: ovr, DEF: 50, PHY: 75 }
      };
    });
  } catch (e) {
    return null;
  }
}

function computePlayerRating(player) {
  const name = player.strPlayer || '';
  if (name.includes('Messi') || name.includes('Ronaldo')) return 99;
  if (name.includes('Mbappé') || name.includes('Haaland') || name.includes('Vinícius')) return 98;
  if (name.includes('Bellingham') || name.includes('Rodri') || name.includes('De Bruyne') || name.includes('Yamal')) return 95;
  if (name.includes('Kane') || name.includes('Lautaro') || name.includes('Salah')) return 93;
  if (name.includes('Saka') || name.includes('Pedri') || name.includes('Musiala')) return 91;

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
  }
  return 70 + Math.abs(hash % 26);
}

function mapLeagueNameToKey(name) {
  const n = name.toLowerCase();
  if (n.includes('premier') || n.includes('england')) return 'premier';
  if (n.includes('liga') || n.includes('spain')) return 'laliga';
  if (n.includes('serie') || n.includes('italy')) return 'seriea';
  if (n.includes('bundesliga') || n.includes('germany')) return 'bundesliga';
  if (n.includes('ligue') || n.includes('france')) return 'ligue1';
  if (n.includes('argentina') || n.includes('primera')) return 'lfp';
  return 'laliga';
}

function getFlagEmoji(country) {
  const map = {
    'Argentina': '🇦🇷',
    'Brazil': '🇧🇷',
    'Spain': '🇪🇸',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'France': '🇫🇷',
    'Germany': '🇩🇪',
    'Italy': '🇮🇹',
    'Portugal': '🇵🇹',
    'Uruguay': '🇺🇾',
    'Netherlands': '🇳🇱',
    'Belgium': '🇧🇪',
    'Colombia': '🇨🇴'
  };
  return map[country] || '⚽';
}
