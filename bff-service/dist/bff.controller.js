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
exports.BffController = void 0;
const common_1 = require("@nestjs/common");
const bff_service_1 = require("./bff.service");
let BffController = class BffController {
    constructor(bffService) {
        this.bffService = bffService;
    }
    async handleRequest(req, res) {
        try {
            const response = await this.bffService.forwardRequest(req);
            res.status(response.status).send(response.data);
        }
        catch (error) {
            res.status(common_1.HttpStatus.BAD_GATEWAY).send(error.message);
        }
    }
};
exports.BffController = BffController;
__decorate([
    (0, common_1.All)('*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BffController.prototype, "handleRequest", null);
exports.BffController = BffController = __decorate([
    (0, common_1.Controller)('bff'),
    __metadata("design:paramtypes", [bff_service_1.BffService])
], BffController);
//# sourceMappingURL=bff.controller.js.map