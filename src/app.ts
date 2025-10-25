import 'dotenv/config';
import express, { type Application } from 'express';
import { WordMap } from './domain/wordMap.interface';
import words from '../data/words.json';
import cron from 'node-cron';

const wordList: WordMap[] = words as WordMap[];
const notifyChannel: string = 'words';
const notifyUrl: string = 'https://ntfy.sh/' + notifyChannel;
const cronSchedule: string = '*/30 * * * *'; // Every 30 minutes

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.type('html').send(html);
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const server = app.listen(PORT, () => {
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

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Word Generator!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Word Generator!
    </section>
  </body>
</html>
`