import * as Express from "express";
import { responseForger } from "../utils/request";

export function auth(app: Express.Express) {
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
}
