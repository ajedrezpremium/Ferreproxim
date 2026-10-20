/* ═══════════ Ferreproxim · Configuración (plantilla) ═══════════
   js/config.js (público) se sube al repo SIN claves.
   Para desarrollo local crea js/config.local.js (ignorado por git):
     window.FERRE_CONFIG_LOCAL = { openrouter: { key: 'sk-or-...' } };
   En producción la clave se configura en Vercel:
     OPENROUTER_API_KEY = sk-or-...
     OPENROUTER_MODEL   = minimax/minimax-m3.1-flash:free (opcional)          */
window.FERRE_CONFIG = {
  apiProxy: '/api/chat',
  openrouter: {
    endpoint: 'https://openrouter.ai/api/v1',
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
