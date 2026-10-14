// Edición numerada limitada — compartido entre el front y el backend.
// Cada rango tiene el doble de copias que el rango superior:
//   Challenger 1 · Gran Maestro 2 · Maestro 4 · Diamante 8 · Esmeralda 16
//   Platino 32 · Oro 64 · Plata 128 · Bronce 256 · Hierro 512  => 1023 cartas.
// El número de serie es global y define el rango:
//   #1 Challenger · #2-3 Gran Maestro · #4-7 Maestro · #8-15 Diamante · ... · #512-1023 Hierro
// El float (0 a 1) es aleatorio para cada carta y se guarda en la base al crearla.

// Orden de mejor a peor
export const TIER_ORDER = [
  'CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND', 'EMERALD',
  'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'
];

export const TOTAL_SUPPLY = 2 ** TIER_ORDER.length - 1; // 1023

// Rango de seriales de cada rareza: [2^k, 2^(k+1) - 1]
export const SERIAL_RANGES = Object.fromEntries(
  TIER_ORDER.map((id, k) => [id, { start: 2 ** k, end: 2 ** (k + 1) - 1, supply: 2 ** k }])
);

export function getRarityFromSerial(serial) {
  const k = Math.floor(Math.log2(serial));
  return TIER_ORDER[Math.min(k, TIER_ORDER.length - 1)];
}

export function formatFloat(f) {
  return Number(f).toFixed(6);
}

export function formatSerial(serial) {
  return `#${String(serial).padStart(4, '0')}`;
}

// Catálogo de sobres (el backend usa estos precios, no los del cliente)
export const PACKS = {
  BRONZE: { cost: 100, isGems: false },
  SILVER: { cost: 250, isGems: false },
  GOLD: { cost: 500, isGems: false },
  CHALLENGER: { cost: 20, isGems: true }
};

// Probabilidades por sobre: [rango, % acumulado]
export const PACK_ODDS = {
  CHALLENGER: [['CHALLENGER', 6], ['GRANDMASTER', 20], ['MASTER', 45], ['DIAMOND', 75], ['EMERALD', 100]],
  GOLD: [['CHALLENGER', 2], ['GRANDMASTER', 5], ['MASTER', 12], ['DIAMOND', 25], ['EMERALD', 45], ['PLATINUM', 70], ['GOLD', 100]],
  SILVER: [['MASTER', 1], ['DIAMOND', 4], ['EMERALD', 10], ['PLATINUM', 25], ['GOLD', 50], ['SILVER', 80], ['BRONZE', 100]],
  BRONZE: [['GOLD', 1], ['SILVER', 5], ['BRONZE', 25], ['IRON', 100]]
};

export function rollRarity(packType) {
  const table = PACK_ODDS[packType] || PACK_ODDS.BRONZE;
  const rand = Math.random() * 100;
  return table.find(([, cum]) => rand < cum)[0];
}
