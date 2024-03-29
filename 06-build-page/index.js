const fs = require('fs');
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');

const styleFrom = path.join(__dirname, 'styles');
const styleTo = path.join(projectPath, 'style.css');

async function build() {
  fs.promises.mkdir(projectPath, { recursive: true });

  const templates = await fs.promises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  let htmlString = templates;

  const components = await fs.promises.readdir(
    path.join(__dirname, 'components'),
  );

  for (let file of components) {
    if (path.extname(path.join(__dirname, 'components', file)) === '.html') {
      const components = await fs.promises.readFile(
        path.join(__dirname, 'components', file),
        'utf-8',
      );
      const index = file.indexOf('.');
      htmlString = htmlString.replace(
        `{{${file.slice(0, index)}}}`,
        components,
      );
    }
  }

  await fs.promises.writeFile(path.join(projectPath, 'index.html'), htmlString);
}

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

const assetsFrom = path.join(__dirname, 'assets');
const assetsTo = path.join(projectPath, 'assets');

async function copyDir(from, to) {
  await fs.promises.mkdir(to, { recursive: true });

  const original = await fs.promises.readdir(from, { withFileTypes: true });

  for (let file of original) {
    const currentOriginal = path.join(from, file.name);
    const currentCopy = path.join(to, file.name);

    if ((await fs.promises.stat(currentOriginal)).isDirectory()) {
      await copyDir(currentOriginal, currentCopy);
    } else {
      await fs.promises.copyFile(currentOriginal, currentCopy);
    }
  }
}

async function remove() {
  const copyExists = await fs.promises
    .stat(assetsTo)
    .then(() => true)
    .catch(() => false);
  if (copyExists) {
    await fs.promises.rm(assetsTo, { recursive: true });
  }

  await copyDir(assetsFrom, assetsTo);
}

build();
bundle(styleFrom, styleTo);
remove();
