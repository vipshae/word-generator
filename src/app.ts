import express, { type Application } from 'express';
import { WordMap } from './domain/wordMap.interface';
import words from '../data/words.json';
import cron from 'node-cron';
import 'dotenv/config';

const wordList: WordMap[] = words as WordMap[];

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  cron.schedule('*/30 * * * *', async() => {
    const random: WordMap = wordList[Math.floor(Math.random() * wordList.length)];
    const wordsApiBaseUrl = `https://${process.env.RAPIDAPI_HOST}/words/${random.word}/synonyms`;
    const wordsApiOptions = {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.RAPIDAPI_HOST || '',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || ''
      }
    };
    const response = await fetch(wordsApiBaseUrl, wordsApiOptions);
    const resultSynonym = await response.json();   
    fetch('https://ntfy.sh/words', {
        method: 'POST',
        body: `${random.word.toUpperCase()} : ${random.meaning}, Synonyms: ${resultSynonym.synonyms}`,
        headers: {
            'Title': 'Learn a new word',
            'Priority': 'high',
            'Tags': 'warning,heart',
            'Actions': `view, More details, https://www.dictionary.com/browse/${random.word}`
        }
    })    
    console.log('Task executed: Sent word of the hour notification');    
  });  
});