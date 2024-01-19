const fs = require('fs');
const path = require('path');

const filesToCopy = path.join(__dirname, 'files');
const copiedFiles = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fs.promises.mkdir(copiedFiles, { recursive: true });

  const original = await fs.promises.readdir(filesToCopy);
  const copy = await fs.promises.readdir(copiedFiles);

  for (let file of copy) {
    if (!original.includes(file)) {
      await fs.promises.unlink(path.join(copiedFiles, file));
    }
  }

  for (let file of original) {
    await fs.promises
      .copyFile(path.join(filesToCopy, file), path.join(copiedFiles, file))
      .catch((err) => console.log(err));
  }
}

copyDir();
