import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { PLAYERS } from '../data/futbolData';
import { TIER_ORDER } from '../data/serials';

const AlbumContext = createContext();
const USER_KEY = 'futbol-album-user-id';

// Identificador anónimo del jugador (se guarda en el navegador; los datos viven en Atlas)
function getUserId() {
  let id = null;
  try { id = localStorage.getItem(USER_KEY); } catch { /* sin storage */ }
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^A-Za-z0-9_-]/g, '');
    try { localStorage.setItem(USER_KEY, id); } catch { /* sin storage */ }
  }
  return id;
}

const toInstance = c => ({ instanceId: `S-${c.serial}`, serial: c.serial, cardRarity: c.rarity, float: c.float });

export function AlbumProvider({ children }) {
  const [userId] = useState(getUserId);
  const [state, setState] = useState(null);
  const [apiError, setApiError] = useState(null);

  const call = useCallback(async (action, params = {}) => {
    const res = await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, userId, ...params })
    });
    let data = {};
    try { data = await res.json(); } catch { /* respuesta vacía */ }
    if (data.state) setState(data.state);
    if (!res.ok) {
      const err = new Error(data.error || `Error ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data;
  }, [userId]);

  useEffect(() => {
    call('state').catch(e => setApiError(e.message));
  }, [call]);

  const coins = state?.user.coins ?? 0;
  const gems = state?.user.gems ?? 0;
  const gluedStickers = state?.user.glued ?? {};
  const packsOpenedCount = state?.user.packsOpened ?? 0;
  const poolSize = state?.poolSize ?? 0;
  const poolCounts = state?.poolCounts ?? Object.fromEntries(TIER_ORDER.map(id => [id, 0]));

  // playerId -> [{ instanceId, serial, cardRarity, float }]
  const cardInventory = useMemo(() => {
    const inv = {};
    (state?.cards || []).forEach(c => { (inv[c.playerId] = inv[c.playerId] || []).push(toInstance(c)); });
    return inv;
  }, [state]);

  const glueSticker = async (playerId) => {
    try { await call('glue', { playerId }); return true; } catch { return false; }
  };

  const sellDuplicateCard = async (playerId, instanceId) => {
    const serial = Number(String(instanceId).replace('S-', ''));
    try { const { reward } = await call('sell', { serial }); return reward; } catch (e) { setApiError(e.message); return 0; }
  };

  const fuseCards = async (playerId) => {
    try { return await call('fuse', { playerId }); } catch (e) { return { error: e.message }; }
  };

  const openBoosterPack = async (packType) => {
    try {
      const { drawn } = await call('openPack', { packType });
      return drawn.map(c => ({ ...PLAYERS.find(p => p.id === c.playerId), ...toInstance(c) }));
    } catch (e) {
      setApiError(e.message);
      return null;
    }
  };

  const claimDailyReward = () => call('daily').catch(e => setApiError(e.message));
  const resetCollection = () => call('reset').catch(e => setApiError(e.message));

  const totalPlayersCount = PLAYERS.length;
  const gluedCount = Object.keys(gluedStickers).length;
  const progressPercent = Math.round((gluedCount / totalPlayersCount) * 100);

  const getPlayerCards = (playerId) => cardInventory[playerId] || [];
  // Mejor carta = serial más bajo
  const getBestCard = (playerId) => {
    const cards = cardInventory[playerId] || [];
    return cards.length ? cards.reduce((b, c) => (c.serial < b.serial ? c : b), cards[0]) : null;
  };
  const getBestCardRarity = (playerId) => getBestCard(playerId)?.cardRarity || null;

  return (
    <AlbumContext.Provider value={{
      loading: !state && !apiError,
      apiError,
      clearApiError: () => setApiError(null),
      coins,
      gems,
      cardInventory,
      gluedStickers,
      packsOpenedCount,
      progressPercent,
      gluedCount,
      totalPlayersCount,
      poolSize,
      poolCounts,
      glueSticker,
      sellDuplicateCard,
      fuseCards,
      openBoosterPack,
      claimDailyReward,
      resetCollection,
      getPlayerCards,
      getBestCard,
      getBestCardRarity
    }}>
      {children}
    </AlbumContext.Provider>
  );
}

export function useAlbum() {
  return useContext(AlbumContext);
}
