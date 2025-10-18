import 'dotenv/config';
import express, { type Application } from 'express';
import { WordMap } from './domain/wordMap.interface';
import words from '../data/words.json';
import cron from 'node-cron';

const wordList: WordMap[] = words as WordMap[];
const notifyChannel: string = 'words';
const notifyUrl: string = 'https://ntfy.sh/' + notifyChannel;
const cronSchedule: string = '* * * * *'; // Every 30 minutes

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Word Generator and Notifier Service!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  if (!process.env.RAPIDAPI_HOST || !process.env.RAPIDAPI_KEY) {
    console.error('RAPIDAPI_HOST and RAPIDAPI_KEY must be set in environment variables');
    process.exit(1);
  }

  cron.schedule(cronSchedule, async() => {
    const random: WordMap = wordList[Math.floor(Math.random() * wordList.length)];
    const wordsApiBaseUrl = `https://${process.env.RAPIDAPI_HOST}/words/${random.word}/`;
    const wordsApiOptions = {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.RAPIDAPI_HOST || '',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || ''
      }
    };
    try {
      // Fetch synonyms from WordsAPI
      const response = await fetch(wordsApiBaseUrl + 'synonyms', wordsApiOptions).catch((error) => {
        throw new Error(JSON.stringify({
          message: 'Failed to fetch synonyms from WordsAPI',
          cause: error
        }));
      }); 
      const synonymsResult = await response.json();
      // Send notification via ntfy.sh
      await fetch(notifyUrl, {
          method: 'POST',
          body: `${random.word.toUpperCase()} : ${random.meaning}, Synonyms: ${synonymsResult.synonyms}`,
          headers: {
              'Title': 'Learn a new word',
              'Priority': 'high',
              'Tags': 'warning,heart',
              'Actions': `view, More details, https://www.dictionary.com/browse/${random.word}`
          }
      }).catch((error) => {
          throw new Error(JSON.stringify({
            message: 'Failed to send notification',
            cause: error
          }));
      });
    } catch (error: unknown) {
        try {
          const parsedError = typeof error === 'string' ? JSON.parse(error) : error;
          console.error('An error occurred', parsedError);
        } catch {
          console.error('An unexpected error occurred', error);
        }
    }
    console.log('Task executed: Successfully sent word notification');    
  });  
});