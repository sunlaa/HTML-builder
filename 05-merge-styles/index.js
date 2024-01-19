const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundle(from, to) {
  const stylesFiles = await fs.promises.readdir(from, {
    withFileTypes: true,
  });

  const output = fs.createWriteStream(to);

  for (let file of stylesFiles) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const input = fs.createReadStream(path.join(from, file.name));

      let data = [];

      input.on('data', (chunck) => {
        data.push(chunck);
      });

      input.on('end', () => {
        for (let piece of data) {
          output.write(piece);
        }
      });
    }
  }
}

bundle(stylePath, bundlePath);
