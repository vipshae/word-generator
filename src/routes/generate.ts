import { Router,  type Request, type Response } from 'express';
import { WordMap } from '../domain/wordMap.interface.js';

const generateRoute = (wordList: WordMap[]) => {
    const router = Router();

    router.get('/', (req: Request, res: Response) => {
        const random: WordMap = wordList[Math.floor(Math.random() * wordList.length)];
        // TODO: Integrate with rapidapi.com to fetch word meaning and details
        res.json({
            'Word of the hour' : random.word,
            'Meaning': random.meaning
        });
    });

    return router;
};

export default generateRoute;