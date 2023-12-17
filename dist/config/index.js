"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// cwd = current working directory (অর্থাৎ আমরা এখন যে পাইলে আছি এটা)
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') }); // এখানে ২ টা জয়েন করে দিয়েছে
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    // database_url: process.env.DATABASE_URL_COMPASS,
    database_url: process.env.DATABASE_URL_ATLAS,
    default_student_pass: process.env.DEFAULT_STUDENT_PASS,
    default_moderator_pass: process.env.DEFAULT_MODERATOR_PASS,
    default_admin_pass: process.env.DEFAULT_ADMIN_PASS,
    bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    imgbb_key: process.env.IMGBB_KEY,
    crypto_key: process.env.ENCRYPTION_SECRET,
    resetlink: "",
    jwt: {
        secret: process.env.JWT_SECRET,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    },
};
