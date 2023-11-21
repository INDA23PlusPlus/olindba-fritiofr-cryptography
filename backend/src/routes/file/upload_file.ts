import Ajv from "ajv";
import * as path from "path";
import * as Express from "express";
import { promises as fs } from "fs";
import { responseForger } from "../../utils/request";
import { database } from "../../db";

const ajv = new Ajv();

type Schema = {
  name: string;
  data: string;
}

const validate = ajv.compile<Schema>({
  type: "object",
  properties: {
    name: { type: "string", pattern: /^[a-zA-Z]+$/.toString().slice(1, -1) },
    data: { type: "string" },
  },
  required: ["name", "data"],
  additionalProperties: false,
});

export function uploadFile(app: Express.Express) {
  app.post("/api/v1/file", async (req, res) => {
    const forge = responseForger(res);
    const db = database();

    try {
      const body = req.body;

      if (!validate(body)) {
        return void forge(400);
      }

      const { name, data } = body;

      const file_exists = await db.has(name);

      if (file_exists) {
        await db.rm(name);
      }

      const raw = Buffer.from(data, "base64");
      const p = path.resolve(__dirname, `../../../files/${name}`);

      await fs.writeFile(p, raw);
      await db.add(name, p).catch(async () => {
        await fs.unlink(p);
        throw new Error();
      });

      return void forge(200);
    } catch (e) {
      console.error(e);

      return void forge(500);
    }
  });
}
