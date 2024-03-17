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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_at_guard_1 = require("../auth/guards/jwt_at.guard");
const roles_guard_1 = require("./guards/roles.guard");
const typeDef_dto_1 = require("../typeDef.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getAllUsers() {
        return this.adminService.getAllUsers();
    }
};
exports.AdminController = AdminController;
__decorate([
    openapi.ApiOperation({ description: "API Endpoint to Get all registered Users" }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, common_1.Get)('users'),
    openapi.ApiResponse({ status: 200, type: [require("../user/entities/user.entity").User] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllUsers", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_at_guard_1.JwtGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)('roles', [typeDef_dto_1.UserRole.Moderator, typeDef_dto_1.UserRole.Admin]),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map