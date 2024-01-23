const { stdout, stdin, exit } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello, write your text here:\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  } else {
    output.write(data);
  }
});

process.on('exit', () => {
  stdout.write('\nThank you, goodbye!\n');
});

process.on('SIGINT', () => {
  exit();
});
