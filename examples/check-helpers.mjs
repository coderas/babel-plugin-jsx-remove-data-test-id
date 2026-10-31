import fs from 'node:fs';
import path from 'node:path';

export const readOutput = dir =>
  fs
    .readdirSync(dir)
    .map(file => fs.readFileSync(path.join(dir, file), 'utf8'))
    .join('\n');

export const assertRemoved = (output, attributes) => {
  attributes.forEach(attribute => {
    if (output.includes(`"${attribute}"`)) {
      throw new Error(`${attribute} was not removed`);
    }
  });
};

export const assertKept = (output, attributes) => {
  attributes.forEach(attribute => {
    if (!output.includes(attribute)) {
      throw new Error(`${attribute} was removed`);
    }
  });
};
