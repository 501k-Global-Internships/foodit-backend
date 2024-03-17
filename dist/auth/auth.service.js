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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../user/entities/user.entity");
const email_service_1 = require("../email/email.service");
const config_1 = require("@nestjs/config");
const utils_1 = require("../utils/utils");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, configService, emailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
        this.logout = async (id) => await this.userRepository.update(id, { refreshToken: null });
        this.generateAccessToken = (payload) => this.jwtService.signAsync(payload);
    }
    async createUser(userDetails) {
        try {
            const newUser = this.userRepository.create(userDetails);
            const savedUser = await this.userRepository.save(newUser);
            const payload = { sub: savedUser.id, email: savedUser.email };
            const accessToken = await this.generateAccessToken(payload);
            const refreshToken = await this.generateRefreshToken(payload);
            this.emailService.sendUserWelcomeEmail(savedUser, '12345');
            return { accessToken, refreshToken };
        }
        catch (error) {
            return error.sqlMessage;
        }
    }
    async login(loginDetails) {
        const payload = await this.findByCredentials(loginDetails);
        const accessToken = await this.generateAccessToken(payload);
        const refreshToken = await this.generateRefreshToken(payload);
        return { accessToken, refreshToken };
    }
    async refreshToken(refreshToken, payload) {
        const user = await this.userRepository.findOneBy({ id: payload.sub });
        if (user && (await bcrypt.compare(refreshToken, user.refreshToken))) {
            const accessToken = await this.generateAccessToken(payload);
            const refreshToken = await this.generateRefreshToken(payload);
            return { accessToken, refreshToken };
        }
        throw new common_1.ForbiddenException('Access Denied!!!');
    }
    async findByCredentials({ email, password }) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user)
            throw new common_1.BadRequestException('User does not exist!, Kindly signup');
        if (await bcrypt.compare(password, user.password)) {
            const payload = { sub: user.id, email: user.email };
            return payload;
        }
        else {
            throw new common_1.BadRequestException('Invalid Email or Password, Please check your login credentials');
        }
    }
    async generateRefreshToken(payload) {
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
            secret: this.configService.get('JWT_RT_SECRET'),
        });
        const hashedRt = await (0, utils_1.hashData)(refreshToken);
        await this.userRepository.update({ id: payload.sub }, { refreshToken: hashedRt });
        return refreshToken;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map