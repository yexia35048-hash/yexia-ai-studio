import fs from 'fs';
const buf = fs.readFileSync('dist/icon-192.png');
console.log(buf.slice(0, 8).toString('hex'));
