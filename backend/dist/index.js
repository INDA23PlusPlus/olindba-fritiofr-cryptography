"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const get_file_1 = require("./routes/file/get_file");
const upload_file_1 = require("./routes/file/upload_file");
const db_1 = require("./db");
const app = express();
app.use(bodyParser.json());
app.use((req, _, next) => {
    console.log(req.method, req.url);
    next();
});
(0, get_file_1.getFile)(app);
(0, upload_file_1.uploadFile)(app);
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield (0, db_1.database)().init();
    }
    catch (e) { }
    const PORT = Number((_a = process.env['PORT']) !== null && _a !== void 0 ? _a : 3000);
    app.listen(PORT, "0.0.0.0", () => console.log(`Listening on port ${PORT}`));
}))();
