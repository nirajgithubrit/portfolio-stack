import 'dotenv/config';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';

const port = Number(process.env.PORT) || 4000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

await connectDb(mongoUri);
const app = createApp();
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
