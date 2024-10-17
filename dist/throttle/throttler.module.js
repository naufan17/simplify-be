"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottlerModule = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
Object.defineProperty(exports, "ThrottlerModule", { enumerable: true, get: function () { return throttler_1.ThrottlerModule; } });
let ThrottlerModule = class ThrottlerModule {
};
exports.ThrottlerModule = ThrottlerModule;
exports.ThrottlerModule = throttler_1.ThrottlerModule = __decorate([
    (0, common_1.Module)({
        ThrottlerModule: throttler_1.ThrottlerModule, : .forRoot([{
                ttl: 600,
                limit: 100
            }]),
    })
], throttler_1.ThrottlerModule);
