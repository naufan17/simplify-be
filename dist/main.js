"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
const common_1 = require("@nestjs/common");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const port = process.env.PORT || 8000;
        const hostname = process.env.HOSTNAME || 'localhost';
        app.use((0, helmet_1.default)());
        app.enableCors();
        app.setGlobalPrefix('api');
        // URI versioning
        app.enableVersioning({
            type: common_1.VersioningType.URI,
            defaultVersion: '1.0',
            prefix: 'v',
        });
        // Global validation pipes
        app.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true
            }
        }));
        yield app.listen(port);
        console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
    });
}
bootstrap();
