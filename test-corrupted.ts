import { Jimp } from 'jimp';
import fs from 'fs';

async function test() {
  try {
    // Create a corrupted PNG
    fs.writeFileSync('corrupted.png', Buffer.from('efbfbd504e470d0a', 'hex'));
    console.log('Testing corrupted image...');
    await Jimp.read('corrupted.png');
  } catch (err) {
    console.error('Error parsing corrupted image:', err);
  }
}

test();
