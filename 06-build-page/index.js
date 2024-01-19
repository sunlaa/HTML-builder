const fs = require('fs');
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');

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
build();
