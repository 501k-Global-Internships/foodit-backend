"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashData = void 0;
const bcrypt = require("bcrypt");
const hashData = (data) => bcrypt.hash(data, 10);
exports.hashData = hashData;
//# sourceMappingURL=utils.js.map