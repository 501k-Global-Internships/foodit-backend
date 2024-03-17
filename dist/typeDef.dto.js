"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtPayload = exports.Tokens = exports.UserRole = void 0;
const openapi = require("@nestjs/swagger");
var UserRole;
(function (UserRole) {
    UserRole["User"] = "user";
    UserRole["Admin"] = "admin";
    UserRole["Vendor"] = "vendor";
    UserRole["Moderator"] = "moderator";
})(UserRole || (exports.UserRole = UserRole = {}));
class Tokens {
    static _OPENAPI_METADATA_FACTORY() {
        return { accessToken: { required: true, type: () => String, description: "example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJwcmluY2Vpc21haWwwOTVAZ21haWwuY29tIiwiaWF0IjoxNzEwMDg4MjczLCJleHAiOjE3MTAwODkxNzN9._VW8yfKhQWrVtD0JErygC0ly007QMiFefunupllXW9Y" }, refreshToken: { required: true, type: () => String, description: "example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJwcmluY2Vpc21haWwwOTVAZ21haWwuY29tIiwiaWF0IjoxNzEwMDg4MjczLCJleHAiOjE3MTAwODkxNzN9._VW8yfKhQWrVtD0JErygC0ly007QMiFefunupllXW9Y" } };
    }
}
exports.Tokens = Tokens;
class JwtPayload {
    static _OPENAPI_METADATA_FACTORY() {
        return { sub: { required: true, type: () => Number }, email: { required: true, type: () => String } };
    }
}
exports.JwtPayload = JwtPayload;
//# sourceMappingURL=typeDef.dto.js.map