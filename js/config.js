/* ═══════════ Ferreproxim · Configuración pública (segura para git) ═══════════
   No contiene claves privadas. En local, js/config.local.js aporta la API key
   de OpenRouter (ignorado por git). En producción la clave vive en Vercel.    */
window.FERRE_CONFIG = {
  /* Proxy serverless: mantiene la API key fuera del navegador */
  apiProxy: '/api/chat',
  openrouter: {
    endpoint: 'https://openrouter.ai/api/v1',
    model: 'minimax/minimax-m3.1-flash:free',
    freeModels: [
      'minimax/minimax-m3.1-flash:free',
      'google/gemma-4-31b-it:free',
      'nvidia/nemotron-3.5-lightning:free',
      'thinkingmachines/inkling:free'
    ]
  },
  /* Supabase: la anon key es pública por diseño.
     Activa enabled:true cuando exista la tabla `products`. */
  supabase: {
    enabled: false,
    url: 'https://uzfwnsbacqbldxuvvduc.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Znduc2JhY3FibGR4dXZ2ZHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0OTc5OTQsImV4cCI6MjEwODA3Mzk5NH0.r9vhiUruBkjwQcrNMFXtpUal0ezt2gIiSDVknQaPsLw'
  },
  /* Empresa */
  company: {
    name: 'Ferreproxim · Bermo Ferretería',
    web: 'https://bermoferreteria.com/',
    address: 'R. de Pizarro, 38, 36204 Vigo, Pontevedra',
    phone: '986 138 596',
    email: 'vigo8019@ferreproxim.es',
    whatsapp: '+34986138596' // confirmar número de WhatsApp Business
  }
};
