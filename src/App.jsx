import React, { useState } from 'react';
import { AlbumProvider, useAlbum } from './context/AlbumContext';
import Header from './components/Header';
import AlbumView from './components/AlbumView';
import PackOpener from './components/PackOpener';
import InventoryView from './components/InventoryView';

export default function App() {
  const [activeTab, setActiveTab] = useState('album');

  return (
    <AlbumProvider>
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans selection:bg-amber-500 selection:text-gray-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-gray-950 to-black">
        {/* Top Navigation */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <StatusBanner />

        {/* Main Workspace View */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          {activeTab === 'album' && <AlbumView />}
          {activeTab === 'packs' && <PackOpener />}
          {activeTab === 'inventory' && <InventoryView />}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-900 bg-gray-950/90 py-6 text-center text-xs text-gray-500 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Futbol Album Pro - Colección de Figuritas con Ránquines de Carta al Abrir Sobres.</p>
            <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px] overflow-x-auto max-w-full pb-1">
              <span className="text-gray-500">Rangos:</span>
              <span className="text-gray-400">Hierro</span> •
              <span className="text-amber-500">Bronce</span> •
              <span className="text-slate-300">Plata</span> •
              <span className="text-yellow-400 font-bold">Oro</span> •
              <span className="text-cyan-300">Platino</span> •
              <span className="text-emerald-400">Esmeralda</span> •
              <span className="text-blue-400">Diamante</span> •
              <span className="text-purple-400">Maestro</span> •
              <span className="text-red-400 font-bold">Gran Maestro</span> •
              <span className="text-amber-300 font-black">Challenger ⚡</span>
            </div>
          </div>
        </footer>
      </div>
    </AlbumProvider>
  );
}

function StatusBanner() {
  const { loading, apiError, clearApiError } = useAlbum();
  if (loading) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4">
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/40 px-4 py-2 text-xs text-cyan-200 font-mono">
          Conectando con la base de datos…
        </div>
      </div>
    );
  }
  if (!apiError) return null;
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4">
      <div className="rounded-2xl border border-red-500/40 bg-red-950/50 px-4 py-2 text-xs text-red-200 flex items-center justify-between gap-3">
        <span>{apiError}</span>
        <button onClick={clearApiError} className="text-red-300 hover:text-white font-bold cursor-pointer">Cerrar</button>
      </div>
    </div>
  );
}
