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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new sqlite3_1.default.Database('./files.db');
function database() {
    return {
        init: () => __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                db.run(`CREATE TABLE files (
        name VARCHAR(255) NOT NULL UNIQUE,
        path VARCHAR(255) NOT NULL
      )`, (err) => {
                    if (err) {
                        reject();
                    }
                    else {
                        resolve();
                    }
                });
            });
        }),
        has: (name) => __awaiter(this, void 0, void 0, function* () {
            const has_file = yield new Promise((resolve, reject) => {
                db.get(`SELECT * FROM files WHERE name = ?`, [name], (err, row) => {
                    if (err) {
                        reject();
                    }
                    else {
                        resolve(!!row);
                    }
                });
            });
            return has_file;
        }),
        add: (name, path) => __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                db.run(`INSERT INTO files (name, path) VALUES (?, ?)`, [name, path], (err) => {
                    console.error(err);
                    if (err) {
                        reject();
                    }
                    else {
                        resolve();
                    }
                });
            });
        })
    };
}
exports.database = database;
