const fs = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true })
  .then((files) => {
    for (let file of files) {
      if (!file.isFile()) {
        continue;
      } else {
        const fullName = file.name;
        const endIndex = fullName.indexOf('.');
        const fileName = fullName.slice(0, endIndex);
        const fileExt = path.extname(fullName);
        fs.stat(path.join(dirPath, `${fullName}`))
          .then((file) => {
            const fileSize = file.size;
            console.log(`${fileName} - ${fileExt} - ${fileSize}B`);
          })
          .catch((err) => console.log(err));
      }
    }
  })
  .catch((err) => console.log(err));
