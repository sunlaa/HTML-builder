const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, 'styles');

async function bundle() {
  const stylesFiles = await fs.promises.readdir(stylePath, {
    withFileTypes: true,
  });

  const output = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
  );

  for (let file of stylesFiles) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const input = fs.createReadStream(path.join(stylePath, file.name));

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

bundle();
