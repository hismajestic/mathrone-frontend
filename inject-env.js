const fs = require('fs');
const buildTime = Date.now().toString();

// Bust SW cache on every deploy
const sw = fs.readFileSync('sw.js', 'utf8').replace('{{BUILD_TIME}}', buildTime);
fs.writeFileSync('sw.js', sw);

// Inject Supabase env vars into index.html from Cloudflare Pages environment
const sbAnonKey = process.env.SB_ANON_KEY || process.env.VITE_SB_KEY || '';
const sbUrl = process.env.SB_URL || process.env.VITE_SB_URL || '';
if (sbAnonKey || sbUrl) {
  let html = fs.readFileSync('index.html', 'utf8');
  if (sbAnonKey) html = html.replace('__SB_ANON_KEY__', sbAnonKey);
  if (sbUrl) html = html.replace('__SB_URL__', sbUrl);
  fs.writeFileSync('index.html', html);
  console.log(' Supabase env vars injected into index.html');
} else {
  console.warn(' Warning: SB_ANON_KEY / SB_URL not set — Supabase realtime will use fallback URL');
}

console.log(` SW cache version: mathrone-${buildTime}`);
