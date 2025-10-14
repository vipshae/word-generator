import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'words.txt');
const outputFilePath = path.join(process.cwd(), 'data', 'words.json');

const lines = fs.readFileSync(dataFilePath, 'utf-8').split('\n').filter(Boolean);

const result = lines.map(line => {
  const match = line.match(/^(\d+)\s+([^\s]+)\s+(.*)$/);
  if (!match) return null;
  const [, index, word, meaning] = match;
  return {
    index: Number(index),
    word,
    meaning: meaning.trim()
  };
}).filter(Boolean);

fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));
console.log('Conversion complete!');