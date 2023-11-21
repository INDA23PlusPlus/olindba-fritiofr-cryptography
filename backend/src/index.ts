import express = require('express');
import bodyParser = require('body-parser');

import { getFile } from './routes/file/get_file';
import { uploadFile } from './routes/file/upload_file';
import { database } from './db';
import { responseForger } from './utils/request';
require('dotenv').config()

const app = express();

app.use(bodyParser.json());

app.use((req, _, next) => {
  console.log(req.method, req.url);
  next();
});

app.use((req, res, next) => {
  const forge = responseForger(res);
  const [username, password] = Buffer.from((req.headers.authorization ?? '').replace(/^Basic /, ""), "base64").toString().split(':');

  if (username == undefined || password == undefined) {
    return void forge(401);
  }

  if (username !== process.env['USERNAME'] || password !== process.env['PASSWORD']) {
    return void forge(403);
  }

  next();
});

getFile(app);
uploadFile(app);

(async () => {
  try {
    await database().init();
  } catch (e) { }


  const PORT = Number(process.env['PORT'] ?? 3000);
  app.listen(PORT, "0.0.0.0", () => console.log(`Listening on port ${PORT}`));
})()
