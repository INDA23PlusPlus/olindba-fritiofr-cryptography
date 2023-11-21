import express = require('express');
import bodyParser = require('body-parser');

import { getFile } from './routes/file/get_file';
import { uploadFile } from './routes/file/upload_file';
import { database } from './db';

import { logger } from './middleware/logger';
import { auth } from './middleware/auth';

require('dotenv').config()

const app = express();

app.use(bodyParser.json());

logger(app);
auth(app);

getFile(app);
uploadFile(app);

(async () => {
  try {
    await database().init();
  } catch (e) { }


  const PORT = Number(process.env['PORT'] ?? 3000);
  app.listen(PORT, "0.0.0.0", () => console.log(`Listening on port ${PORT}`));
})()
