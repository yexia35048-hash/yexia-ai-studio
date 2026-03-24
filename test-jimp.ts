import { Jimp } from 'jimp';

async function test() {
  try {
    const img1 = await Jimp.read('public/icon-192.png');
    console.log('192 parsed successfully:', img1.bitmap.width, 'x', img1.bitmap.height);
    
    const img2 = await Jimp.read('public/icon-512.png');
    console.log('512 parsed successfully:', img2.bitmap.width, 'x', img2.bitmap.height);
  } catch (err) {
    console.error('Error parsing:', err);
  }
}

test();
