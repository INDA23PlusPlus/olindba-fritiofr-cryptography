import * as Express from "express";

export function logger(app: Express.Express) {
  app.use((req, _, next) => {
    console.log(req.method, req.url);
    next();
  });
}
