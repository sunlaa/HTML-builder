const fs = require('fs/promises');
const path = require('path');

const filesToCopy = path.join(__dirname, 'files');
const copiedFiles = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fs.mkdir(copiedFiles, { recursive: true });

  const original = await fs.readdir(filesToCopy);
  const copy = await fs.readdir(copiedFiles);

  for (let file of copy) {
    if (!original.includes(file)) {
      await fs.unlink(path.join(copiedFiles, file));
    }
  }

  for (let file of original) {
    await fs
      .copyFile(path.join(filesToCopy, file), path.join(copiedFiles, file))
      .catch((err) => console.log(err));
  }
}

copyDir();
