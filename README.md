# Word Generator

A simple Express.js application that sends random English words, their meanings, and synonyms as notifications on a schedule. Built with TypeScript.

## Features
- REST API with Express.js
- Scheduled notifications using node-cron
- Fetches word data and synonyms from WordsAPI
- Sends notifications via [ntfy.sh](https://ntfy.sh/)
- TypeScript support

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/vipshae/word-generator.git
   cd word-generator
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the project root with the following variables:
   ```env
   RAPIDAPI_HOST=your-wordsapi-host
   RAPIDAPI_KEY=your-wordsapi-key
   ```

### Development
Run the server in development mode with hot reload:
```sh
npm run dev
```

### Production
1. Build the project:
   ```sh
   npm run build
   ```
2. Start the server:
   ```sh
   npm start
   ```

## API Endpoints
- `GET /` — Main page
- `GET /health` — Health check endpoint

## Scheduling
- The app uses `node-cron` to send notifications at a configurable interval (default: every 30 minutes).
- To change the schedule, edit the `cronSchedule` variable in `src/app.ts`.

## Deployment
- For cloud deployment (e.g., Render), see the [Render documentation](https://render.com/docs).
- Note: Long-running idle servers are not supported on Render Free Tier beyond 15 min of inactivity. Use [Uptime Robot](https://uptimerobot.com) to ping the server every 5 or 10 minutes.

## License
ISC
