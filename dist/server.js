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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
// import { errorLogger, logger } from './app/share/logger';
const logger_1 = require("./app/share/logger");
const index_1 = __importDefault(require("./config/index"));
mongoose_1.default.set('strictQuery', false);
process.on('uncaughtException', error => {
    // console.log('uncaugthException is detected ......', error);
    logger_1.errorLogger.error(error);
    process.exit(1);
});
// database connection
let server; // এটা তারা বুঝায় সার্ভার কোন এক্টিভিটি আছে কিনা
function connection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(index_1.default.database_url);
            logger_1.logger.info(`Database connection successfull`);
            // console.log(`Database connection successfull`);
            app_1.default.listen(index_1.default.port, () => {
                logger_1.logger.info(`Server is listening on port ${index_1.default.port}`);
                // console.log(`Server is listening on port ${config.port}`);
            });
        }
        catch (error) {
            logger_1.errorLogger.error(`Failed to connect database: ${error}`);
            // console.log(`Failed to connect database: ${error}`);
        }
        //যদি এমন কোন error হয় যেটা আমি জানি না ওটার জন্য এটি
        process.on('unhandledRejection', error => {
            //এখানে চেক করবে আগে আমার সার্ভারে কোন কাজ চলতেছে কিনা যদি কোন কাজ চলে তাহলে সে হঠাৎ করে বন্ধ করবে না
            if (server) {
                server.close(() => {
                    logger_1.errorLogger.error(error);
                    // console.log(error);
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    });
}
connection();
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM is received ....');
    // console.log('SIGTERM is received ....');
    if (server) {
        server.close();
    }
});
