"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const signup_dto_1 = require("./dto/signup.dto");
const login_dto_1 = require("./dto/login.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_rt_guard_1 = require("./guards/jwt_rt.guard");
const jwt_at_guard_1 = require("./guards/jwt_at.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    createUser(signupDetails) {
        return this.authService.createUser(signupDetails);
    }
    login(loginDetails) {
        return this.authService.login(loginDetails);
    }
    async logout(req) {
        await this.authService.logout(req.user.id);
        return 'You have successfully logout of the system, see you soon!';
    }
    refresh(req) {
        const user = req.user;
        return this.authService.refreshToken(user['refreshToken'], user['payload']);
    }
};
exports.AuthController = AuthController;
__decorate([
    openapi.ApiOperation({ description: "API Endpoint for User Registration" }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, common_1.Post)('local/signup'),
    openapi.ApiResponse({ status: 201, type: require("../typeDef.dto").Tokens }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createUser", null);
__decorate([
    openapi.ApiOperation({ description: "API Endpoint to Login User" }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid Email or Password, Please check your login credentials',
    }),
    (0, common_1.Post)('local/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("../typeDef.dto").Tokens }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    openapi.ApiOperation({ description: "API Endpoint to Logout User" }),
    (0, common_1.Get)('logout'),
    (0, common_1.UseGuards)(jwt_at_guard_1.JwtGuard),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    openapi.ApiOperation({ description: "API Endpoint to get Refresh Tokens" }),
    (0, common_1.Get)('refresh'),
    (0, common_1.UseGuards)(jwt_rt_guard_1.RefreshTokenGuard),
    openapi.ApiResponse({ status: 200, type: require("../typeDef.dto").Tokens }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map