"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.uploadFile = void 0;
const ajv_1 = __importDefault(require("ajv"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
const request_1 = require("../../utils/request");
const db_1 = require("../../db");
const ajv = new ajv_1.default();
const validate = ajv.compile({
    type: "object",
    properties: {
        name: { type: "string", pattern: /^[a-zA-Z]+$/.toString().slice(1, -1) },
        data: { type: "string" },
    },
    required: ["name", "data"],
    additionalProperties: false,
});
function uploadFile(app) {
    app.post("/api/v1/file", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const forge = (0, request_1.responseForger)(res);
        const db = (0, db_1.database)();
        try {
            const body = req.body;
            if (!validate(body)) {
                return void forge(400);
            }
            const { name, data } = body;
            const file_exists = yield db.has(name);
            if (file_exists) {
                return void forge(409);
            }
            const raw = Buffer.from(data, "base64");
            const p = path.resolve(__dirname, `../../../files/${name}`);
            yield fs_1.promises.writeFile(p, raw);
            yield db.add(name, p).catch(() => __awaiter(this, void 0, void 0, function* () {
                yield fs_1.promises.unlink(p);
                throw new Error();
            }));
            return void forge(200);
        }
        catch (e) {
            console.error(e);
            return void forge(500);
        }
    }));
}
exports.uploadFile = uploadFile;
