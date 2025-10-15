import express, { type Application } from 'express';
import generateRoute from './routes/generate';
import { WordMap } from './domain/wordMap.interface';
import words from '../data/words.json';

const wordList: WordMap[] = words as WordMap[];

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// app.use('/api/generate', generateRoute(wordList));
app.use('/', generateRoute(wordList));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});