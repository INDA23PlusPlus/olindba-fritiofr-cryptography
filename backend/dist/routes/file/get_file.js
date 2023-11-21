"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = void 0;
function getFile(app) {
    app.get("/api/v1/file/:id", (req, res) => {
        req.params.id;
        res.send("Hello World!");
    });
}
exports.getFile = getFile;
