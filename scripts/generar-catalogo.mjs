// Genera js/catalogo.generated.js desde data/catalogo.csv
// Uso: node scripts/generar-catalogo.mjs data/catalogo.csv
import fs from 'node:fs';
import path from 'node:path';

const csvPath = process.argv[2] || path.join('data', 'catalogo.csv');
if (!fs.existsSync(csvPath)) {
  console.error(`No existe el CSV: ${csvPath}`);
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (ch !== '\r') field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const headers = rows.shift().map(h => h.trim());
const idx = Object.fromEntries(headers.map((h, i) => [h, i]));
const get = (r, k) => (idx[k] !== undefined ? String(r[idx[k]] ?? '').trim() : '');

const catalog = rows.map((r, i) => ({
  id: i + 1,
  sku: get(r, 'sku'),
  cat: (get(r, 'categoria') || 'general').toLowerCase(),
  emoji: get(r, 'emoji') || '🔧',
  price: Number(String(get(r, 'precio')).replace(',', '.')) || 0,
  stock: Number(get(r, 'stock')) || 0,
  es: get(r, 'nombre_es'),
  gl: get(r, 'nombre_gl') || get(r, 'nombre_es'),
  en: get(r, 'nombre_en') || get(r, 'nombre_es'),
  kw: get(r, 'keywords'),
})).filter(p => p.sku && p.es);

const out = `/* Generado automáticamente desde ${path.basename(csvPath)} — ${new Date().toISOString()} */\nwindow.FERRE_CATALOGO = ${JSON.stringify(catalog, null, 2)};\n`;
fs.mkdirSync('js', { recursive: true });
fs.writeFileSync(path.join('js', 'catalogo.generated.js'), out, 'utf8');
console.log(`✅ Catálogo generado: ${catalog.length} productos → js/catalogo.generated.js`);
