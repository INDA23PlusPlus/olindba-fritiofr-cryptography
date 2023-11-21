import * as Express from "express";
import { responseForger } from "../../utils/request";
import { database } from "../../db";
import { promises as fs } from "fs";

export function getFile(app: Express.Express) {
  app.get("/api/v1/file", async (req, res) => {
    const forge = responseForger(res);
    const db = database();

    try {
      const name = req.query['name'];
      if (typeof name !== 'string') {
        return void forge(400);
      }
      const file = await db.get(name);

      if (!file) {
        return void forge(404);
      }

      const data = (await fs.readFile(file.path)).toString('base64');

      return void forge({
        status: 200,
        payload: data
      });

    } catch (e) {
      console.error(e);

      return void forge(500);
    }
  });
}
