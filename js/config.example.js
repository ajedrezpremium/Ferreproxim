/* ═══════════ Ferreproxim · Configuración (plantilla pública) ═══════════
   Copia este archivo a js/config.js y rellena tus claves.
   js/config.js y .env están en .gitignore y nunca se suben al repo.      */
window.FERRE_CONFIG = {
  openrouter: {
    endpoint: 'https://openrouter.ai/api/v1',
    key: 'sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXX',
    model: 'minimax/minimax-m3.1-flash:free',
    freeModels: ['minimax/minimax-m3.1-flash:free']
  },
  supabase: {
    enabled: false,
    url: 'https://YOUR-PROJECT.supabase.co',
    anonKey: 'eyJ...anon-public-key...'
  },
  company: {
    name: 'Ferreproxim · Bermo Ferretería',
    web: 'https://bermoferreteria.com/',
    address: 'R. de Pizarro, 38, 36204 Vigo, Pontevedra',
    phone: '986 138 596',
    email: 'vigo8019@ferreproxim.es'
  }
};
