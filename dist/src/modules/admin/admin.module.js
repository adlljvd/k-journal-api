"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const admin_content_service_1 = require("./admin-content.service");
const admin_content_request_service_1 = require("./admin-content-request.service");
const content_module_1 = require("../content/content.module");
const content_request_module_1 = require("../content-request/content-request.module");
const prisma_module_1 = require("../../prisma/prisma.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, content_module_1.ContentModule, content_request_module_1.ContentRequestModule],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, admin_content_service_1.AdminContentService, admin_content_request_service_1.AdminContentRequestService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map