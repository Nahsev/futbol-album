// Lógica del juego contra MongoDB Atlas.
// Colecciones:
//   cards: { _id: serial, serial, rarity, float, ownerId|null, playerId|null }  (1023 documentos, se crean solos)
//   users: { _id: userId, coins, gems, glued: { playerId: true }, packsOpened }
import { MongoClient } from 'mongodb';
import { PLAYERS } from '../src/data/futbolData.js';
import { RARITIES } from '../src/data/rarities.js';
import {
  TIER_ORDER, TOTAL_SUPPLY, PACKS, rollRarity, getRarityFromSerial
} from '../src/data/serials.js';

let clientPromise = null;
let seeded = false;

async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw httpError(500, 'Falta configurar MONGODB_URI (cadena de conexión de MongoDB Atlas).');
  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect().catch(err => { clientPromise = null; throw err; });
  }
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || 'futbol_album');
  await ensureSeed(db);
  return db;
}

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

// Crea las 1023 cartas numeradas la primera vez (cada una con su float aleatorio)
async function ensureSeed(db) {
  if (seeded) return;
  const cards = db.collection('cards');
  const count = await cards.countDocuments();
  if (count < TOTAL_SUPPLY) {
    const existing = new Set((await cards.find({}, { projection: { _id: 1 } }).toArray()).map(d => d._id));
    const docs = [];
    for (let s = 1; s <= TOTAL_SUPPLY; s++) {
      if (existing.has(s)) continue;
      docs.push({ _id: s, serial: s, rarity: getRarityFromSerial(s), float: Math.random(), ownerId: null, playerId: null });
    }
    try {
      if (docs.length) await cards.insertMany(docs, { ordered: false });
    } catch (e) {
      if (e.code !== 11000 && !e.writeErrors) throw e; // otra instancia ya las creó
    }
    await cards.createIndex({ rarity: 1, ownerId: 1 });
    await cards.createIndex({ ownerId: 1, playerId: 1 });
  }
  seeded = true;
}

const randomPlayer = () => PLAYERS[Math.floor(Math.random() * PLAYERS.length)];

async function freeCounts(cards) {
  const counts = Object.fromEntries(TIER_ORDER.map(id => [id, 0]));
  const rows = await cards.aggregate([
    { $match: { ownerId: null } },
    { $group: { _id: '$rarity', n: { $sum: 1 } } }
  ]).toArray();
  rows.forEach(r => { counts[r._id] = r.n; });
  return counts;
}

// Reclama atómicamente una carta libre al azar de un rango
async function claimRandom(cards, rarity, userId, playerId) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const [doc] = await cards.aggregate([
      { $match: { rarity, ownerId: null } },
      { $sample: { size: 1 } }
    ]).toArray();
    if (!doc) return null;
    const claimed = await cards.findOneAndUpdate(
      { _id: doc._id, ownerId: null },
      { $set: { ownerId: userId, playerId, obtainedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (claimed) return claimed;
  }
  return null;
}

// Saca una carta para un sobre. Si el rango sorteado está agotado, vuelve a tirar.
async function drawCard(cards, counts, packType, userId) {
  for (let i = 0; i < 200; i++) {
    const rarity = rollRarity(packType);
    if (!counts[rarity]) continue; // agotado: re-tirar
    const card = await claimRandom(cards, rarity, userId, randomPlayer().id);
    if (card) { counts[rarity]--; return card; }
    counts[rarity] = 0;
  }
  // Todos los rangos de este sobre se agotaron: cualquier carta libre
  const available = TIER_ORDER.filter(r => counts[r] > 0);
  if (!available.length) return null;
  const rarity = available[Math.floor(Math.random() * available.length)];
  const card = await claimRandom(cards, rarity, userId, randomPlayer().id);
  if (card) counts[rarity]--;
  return card;
}

async function createUser(db, userId) {
  const users = db.collection('users');
  const cards = db.collection('cards');
  try {
    await users.insertOne({ _id: userId, coins: 5000, gems: 100, glued: {}, packsOpened: 0, createdAt: new Date() });
  } catch (e) {
    if (e.code === 11000) return; // ya existía (dos requests en paralelo)
    throw e;
  }
  // Cartas de arranque
  for (const rarity of ['IRON', 'IRON', 'IRON', 'BRONZE', 'BRONZE']) {
    await claimRandom(cards, rarity, userId, randomPlayer().id);
  }
}

async function getUser(db, userId) {
  let user = await db.collection('users').findOne({ _id: userId });
  if (!user) {
    await createUser(db, userId);
    user = await db.collection('users').findOne({ _id: userId });
  }
  return user;
}

const publicCard = c => ({ serial: c.serial, rarity: c.rarity, float: c.float, playerId: c.playerId });

async function buildState(db, userId) {
  const user = await getUser(db, userId);
  const cards = db.collection('cards');
  const owned = await cards.find({ ownerId: userId }).sort({ _id: 1 }).toArray();
  const counts = await freeCounts(cards);
  return {
    user: { coins: user.coins, gems: user.gems, glued: user.glued || {}, packsOpened: user.packsOpened || 0 },
    cards: owned.map(publicCard),
    poolCounts: counts,
    poolSize: Object.values(counts).reduce((a, b) => a + b, 0)
  };
}

// ----------------------------------------------------------------------------
const ACTIONS = {
  async state() {
    return {};
  },

  async openPack(db, userId, { packType }) {
    const pack = PACKS[packType];
    if (!pack) throw httpError(400, 'Sobre inválido');
    await getUser(db, userId);
    const cards = db.collection('cards');
    const counts = await freeCounts(cards);
    if (Object.values(counts).every(n => n === 0)) throw httpError(409, 'No quedan cartas en los sobres.');

    const field = pack.isGems ? 'gems' : 'coins';
    const paid = await db.collection('users').updateOne(
      { _id: userId, [field]: { $gte: pack.cost } },
      { $inc: { [field]: -pack.cost, packsOpened: 1 } }
    );
    if (!paid.modifiedCount) throw httpError(402, 'No te alcanza para este sobre.');

    const drawn = [];
    for (let i = 0; i < 5; i++) {
      const card = await drawCard(cards, counts, packType, userId);
      if (!card) break;
      drawn.push(publicCard(card));
    }
    return { drawn };
  },

  async sell(db, userId, { serial }) {
    const cards = db.collection('cards');
    const card = await cards.findOne({ _id: Number(serial), ownerId: userId });
    if (!card) throw httpError(404, 'No tenés esa carta.');
    const user = await getUser(db, userId);
    const sameCount = await cards.countDocuments({ ownerId: userId, playerId: card.playerId });
    if (sameCount <= 1 && user.glued?.[card.playerId]) {
      throw httpError(409, 'Es tu única carta de este jugador y está pegada en el álbum.');
    }
    const released = await cards.updateOne(
      { _id: card._id, ownerId: userId },
      { $set: { ownerId: null, playerId: null }, $unset: { obtainedAt: '' } }
    );
    if (!released.modifiedCount) throw httpError(409, 'La carta ya no es tuya.');
    const reward = RARITIES[card.rarity]?.sellValue || 100;
    await db.collection('users').updateOne({ _id: userId }, { $inc: { coins: reward } });
    return { reward };
  },

  async fuse(db, userId, { playerId }) {
    const cards = db.collection('cards');
    const mine = await cards.find({ ownerId: userId, playerId }).toArray();
    if (mine.length < 3) throw httpError(409, 'Necesitás al menos 3 cartas del mismo rango de este jugador para fusionar.');

    const groups = {};
    mine.forEach(c => { (groups[c.rarity] = groups[c.rarity] || []).push(c); });
    const ascending = [...TIER_ORDER].reverse();
    let soldOut = null;

    for (let i = 0; i < ascending.length - 1; i++) {
      const current = ascending[i];
      const next = ascending[i + 1];
      if (!groups[current] || groups[current].length < 3) continue;

      const newCard = await claimRandom(cards, next, userId, playerId);
      if (!newCard) { soldOut = next; continue; }

      const toFuse = groups[current].slice(0, 3).map(c => c._id);
      await cards.updateMany(
        { _id: { $in: toFuse }, ownerId: userId },
        { $set: { ownerId: null, playerId: null }, $unset: { obtainedAt: '' } }
      );
      return { fusedRarity: current, upgradedRarity: next, serial: newCard.serial };
    }
    if (soldOut) throw httpError(409, `No quedan cartas ${RARITIES[soldOut].name} libres: todas las copias ya tienen dueño.`);
    throw httpError(409, 'Necesitás al menos 3 cartas del mismo rango de este jugador para fusionar.');
  },

  async glue(db, userId, { playerId }) {
    const owns = await db.collection('cards').countDocuments({ ownerId: userId, playerId });
    if (!owns) throw httpError(409, 'No tenés cartas de este jugador.');
    await db.collection('users').updateOne({ _id: userId }, { $set: { [`glued.${playerId}`]: true } });
    return { glued: true };
  },

  async daily(db, userId) {
    await getUser(db, userId);
    await db.collection('users').updateOne({ _id: userId }, { $inc: { coins: 1500, gems: 25 } });
    return {};
  },

  async reset(db, userId) {
    await db.collection('cards').updateMany(
      { ownerId: userId },
      { $set: { ownerId: null, playerId: null }, $unset: { obtainedAt: '' } }
    );
    await db.collection('users').deleteOne({ _id: userId });
    return {};
  }
};

export async function runAction(body = {}) {
  const { action, userId, ...params } = body;
  if (typeof userId !== 'string' || !/^[A-Za-z0-9_-]{8,64}$/.test(userId)) throw httpError(400, 'userId inválido');
  const fn = ACTIONS[action];
  if (!fn) throw httpError(400, 'Acción desconocida');
  if (params.playerId !== undefined && typeof params.playerId !== 'string') throw httpError(400, 'playerId inválido');

  const db = await getDb();
  const result = await fn(db, userId, params);
  const state = await buildState(db, userId);
  return { ...result, state };
}
