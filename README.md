# Futbol Album ⚽

Álbum de figuritas con cartas numeradas de tirada limitada. Todo se guarda en MongoDB Atlas.

## Tirada limitada

| Rango | Copias | Seriales |
|---|---|---|
| ⚡ Challenger | 1 | #0001 |
| 🔴 Gran Maestro | 2 | #0002–0003 |
| 🟣 Maestro | 4 | #0004–0007 |
| 🔷 Diamante | 8 | #0008–0015 |
| 🟢 Esmeralda | 16 | #0016–0031 |
| 💿 Platino | 32 | #0032–0063 |
| 🥇 Oro | 64 | #0064–0127 |
| 🥈 Plata | 128 | #0128–0255 |
| 🥉 Bronce | 256 | #0256–0511 |
| ⚙️ Hierro | 512 | #0512–1023 |

- Cada carta tiene un **float aleatorio de 0 a 1** (más bajo = mejor), fijo desde que se crea.
- Las 1023 cartas son compartidas por todos los jugadores: si alguien tiene la Challenger, nadie más puede sacarla hasta que la venda.
- Si en un sobre te toca un rango agotado, la carta se vuelve a tirar.
- Vender una carta la devuelve a los sobres. Fusionar 3 del mismo rango da 1 del rango siguiente (si quedan libres).

## Fotos de jugadores

Las fotos reales salen de [TheSportsDB](https://www.thesportsdb.com) (clave gratis `123`). El servidor busca cada jugador por nombre, valida que el nombre coincida y guarda la URL en la colección `player_photos` de Atlas, así la API se consulta una sola vez. Si un jugador no aparece, se usa la foto genérica y se reintenta a la semana. Para forzar un nombre de búsqueda, agregá `apiName` al jugador en `src/data/futbolData.js`.

## Correr local

```bash
npm install
cp .env.example .env   # y pegá tu MONGODB_URI
npm run dev
```

La primera llamada crea solas las 1023 cartas en la colección `cards`.

## Deploy en Vercel

Importá el repo en Vercel y agregá la variable de entorno `MONGODB_URI` (y opcional `MONGODB_DB`).
En Atlas, en *Network Access*, permití `0.0.0.0/0` para que Vercel pueda conectarse.
