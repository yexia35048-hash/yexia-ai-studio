import fs from 'fs';
import archiver from 'archiver';
import path from 'path';

const output = fs.createWriteStream(path.join(process.cwd(), 'sudoku-android-project.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Append files from project root, excluding node_modules and .git
const files = fs.readdirSync(process.cwd());
for (const file of files) {
  if (file === 'node_modules' || file === '.git' || file === 'sudoku-android-project.zip' || file === 'sudoku-dist.zip') {
    continue;
  }
  const fullPath = path.join(process.cwd(), file);
  const stats = fs.statSync(fullPath);
  if (stats.isDirectory()) {
    archive.directory(file + '/', file);
  } else {
    archive.file(file, { name: file });
  }
}

archive.finalize();
