import dotenv from 'dotenv';
import path from 'path';
// cwd = current working directory (অর্থাৎ আমরা এখন যে পাইলে আছি এটা)
dotenv.config({ path: path.join(process.cwd(), '.env') }); // এখানে ২ টা জয়েন করে দিয়েছে

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  // database_url: process.env.DATABASE_URL_COMPASS,
  database_url:
    process.env.NODE_ENV === 'development'
      ? process.env.DATABASE_URL_ATLAS
      : process.env.DATABASE_URL_COMPASS,
  default_student_pass: process.env.DEFAULT_STUDENT_PASS,
  default_moderator_pass: process.env.DEFAULT_MODERATOR_PASS,
  default_admin_pass: process.env.DEFAULT_ADMIN_PASS,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  imgbb_key: process.env.IMGBB_KEY,
  crypto_key: process.env.ENCRYPTION_SECRET,
  resetlink: '',
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  // cloudinary_api_secret:process.env.cloudinary_api_secret
};
