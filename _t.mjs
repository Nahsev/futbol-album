import { MongoMemoryServer } from 'mongodb-memory-server';
const m = await MongoMemoryServer.create();
process.env.MONGODB_URI = m.getUri();
const { runAction } = await import(process.cwd() + '/server/game.js');
const A = (b) => runAction(b);
const u1 = 'usuario-uno-123', u2 = 'usuario-dos-456';
let r = await A({ action: 'state', userId: u1 });
console.log('inicio', r.state.cards.length, 'cartas, pool', r.state.poolSize, r.state.cards.map(c=>c.rarity+'#'+c.serial+' f='+c.float.toFixed(4)).join(', '));
// dar muchas gemas y abrir sobres challenger hasta vaciar los rangos altos
const { MongoClient } = await import('mongodb'); const c = await new MongoClient(m.getUri()).connect(); const db = c.db('futbol_album');
await db.collection('users').updateMany({}, { $set: { gems: 100000, coins: 10000000 } });
await A({ action: 'state', userId: u2 }); await db.collection('users').updateMany({}, { $set: { gems: 100000, coins: 10000000 } });
const tally = {};
for (let i = 0; i < 40; i++) { r = await A({ action: 'openPack', userId: i%2?u1:u2, packType: 'CHALLENGER' }); r.drawn.forEach(d => tally[d.rarity] = (tally[d.rarity]||0)+1); }
console.log('40 sobres Challenger:', tally, 'libres:', r.state.poolCounts);
const all = await db.collection('cards').find().toArray();
const ch = all.filter(x=>x.rarity==='CHALLENGER'); console.log('challenger total docs', ch.length, 'owner', ch[0].ownerId);
const floats = all.map(x=>x.float); console.log('float min/max', Math.min(...floats).toFixed(4), Math.max(...floats).toFixed(4), 'únicos', new Set(floats).size, 'de', all.length);
// sell
const mine = (await A({action:'state', userId:u1})).state.cards; const sc = mine[mine.length-1];
r = await A({ action:'sell', userId:u1, serial: sc.serial }); console.log('venta', sc.rarity, '+', r.reward);
try { await A({ action:'sell', userId:u2, serial: sc.serial===1?2:mine[0].serial }); console.log('ERROR: vendió ajena'); } catch(e) { console.log('vender ajena ->', e.message); }
// bronze pack drains
for (let i=0;i<60;i++) { try { r = await A({ action:'openPack', userId:u2, packType:'BRONZE' }); } catch(e){ console.log('bronze stop', i, e.message); break; } }
console.log('tras 60 sobres bronce libres:', r.state.poolCounts);
// fuse
await db.collection('cards').updateMany({ ownerId:u1, rarity:'IRON' }, { $set:{ playerId:'p-messi' } });
r = await A({ action:'fuse', userId:u1, playerId:'p-messi' }); console.log('fusión', r.fusedRarity, '->', r.upgradedRarity, r.serial);
r = await A({ action:'glue', userId:u1, playerId:'p-messi' }); console.log('pegada', r.state.user.glued);
r = await A({ action:'reset', userId:u1 }); console.log('reset ->', r.state.cards.length, 'cartas, coins', r.state.user.coins);
const owned = await db.collection('cards').countDocuments({ ownerId: { $ne: null } }); console.log('total con dueño', owned, 'total', await db.collection('cards').countDocuments());
await c.close(); await m.stop(); process.exit(0);
