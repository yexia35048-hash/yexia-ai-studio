import fs from 'fs';
console.log('192 size:', fs.statSync('dist/icon-192.png').size);
console.log('512 size:', fs.statSync('dist/icon-512.png').size);
