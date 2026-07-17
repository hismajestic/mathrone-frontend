const fs = require('fs');
const buildTime = Date.now().toString();

// Bust SW cache on every deploy
const sw = fs.readFileSync('sw.js', 'utf8').replace('{{BUILD_TIME}}', buildTime);
fs.writeFileSync('sw.js', sw);

console.log(` SW cache version: mathrone-${buildTime}`);
