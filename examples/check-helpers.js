const fs = require('fs');
const path = require('path');

const readOutput = dir =>
  fs
    .readdirSync(dir)
    .map(file => fs.readFileSync(path.join(dir, file), 'utf8'))
    .join('\n');

const assertRemoved = (output, attributes) => {
  attributes.forEach(attribute => {
    if (output.includes(`"${attribute}"`)) {
      throw new Error(`${attribute} was not removed`);
    }
  });
};

const assertKept = (output, attributes) => {
  attributes.forEach(attribute => {
    if (!output.includes(attribute)) {
      throw new Error(`${attribute} was removed`);
    }
  });
};

module.exports = { readOutput, assertRemoved, assertKept };
