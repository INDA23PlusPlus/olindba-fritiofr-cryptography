import * as Express from "express";

export function getFile(app: Express.Express) {
  app.get("/api/v1/file/:id", (req, res) => {
    req.params.id;

    res.send("Hello World!");
  });
}
