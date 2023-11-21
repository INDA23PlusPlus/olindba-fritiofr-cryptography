"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseForger = void 0;
const http_status_codes_1 = require("http-status-codes");
function responseForger(res) {
    const resFunc = (defRes) => {
        var _a, _b, _c, _d, _e;
        if (typeof defRes === 'number') {
            return void resFunc({ status: defRes });
        }
        const status = (_a = defRes.status) !== null && _a !== void 0 ? _a : 200;
        const error = (_b = defRes.error) !== null && _b !== void 0 ? _b : (status >= 400);
        const date = (_c = defRes.date) !== null && _c !== void 0 ? _c : new Date();
        const msg = (_d = defRes.msg) !== null && _d !== void 0 ? _d : (() => {
            try {
                return (0, http_status_codes_1.getReasonPhrase)(status);
            }
            catch (e) {
                return 'Unknown error';
            }
        })();
        const payload = (_e = defRes.payload) !== null && _e !== void 0 ? _e : null;
        const data = {
            status,
            error,
            msg,
            date,
            payload,
        };
        return void res.status(status).send(data).end();
    };
    return resFunc;
}
exports.responseForger = responseForger;
