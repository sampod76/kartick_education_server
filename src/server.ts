import mongoose from 'mongoose';
import app from './app';

import { Server } from 'http';
// import { errorLogger, logger } from './app/share/logger';
import 'colors';
import { errorLogger, logger } from './app/share/logger';
import config from './config/index';
mongoose.set('strictQuery', false);

process.on('uncaughtException', error => {
  config.env === 'production'
    ? errorLogger.error(error)
    : console.log('uncaugthException is detected ......', error);
  process.exit(1);
});
// database connection

let server: Server; // এটা তারা বুঝায় সার্ভার কোন এক্টিভিটি আছে কিনা

async function connection() {
  try {
    await mongoose.connect(config.database_url as string);
    config.env === 'production'
      ? logger.info(`Database connection successfull`.green.underline.bold)
      : console.log(`Database connection successfull`.green.underline.bold);

    app.listen(config.port, (): void => {
      config.env === 'production'
        ? logger.info(
            `Server is listening on port ${config.port}`.red.underline.bold
          )
        : console.log(
            `Server is listening on port ${config.port}`.red.underline.bold
          );
    });
  } catch (error) {
    config.env === 'production'
      ? errorLogger.error(`Failed to connect database: ${error}`.red.bold)
      : console.log(`Failed to connect database: ${error}`.red.bold);
  }

  //যদি এমন কোন error হয় যেটা আমি জানি না ওটার জন্য এটি
  process.on('unhandledRejection', error => {
    //এখানে চেক করবে আগে আমার সার্ভারে কোন কাজ চলতেছে কিনা যদি কোন কাজ চলে তাহলে সে হঠাৎ করে বন্ধ করবে না
    if (server) {
      server.close(() => {
        config.env === 'production'
          ? errorLogger.error(error)
          : console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
connection();

process.on('SIGTERM', () => {
  // logger.info('SIGTERM is received ....');
  // console.log('SIGTERM is received ....');
  if (server) {
    server.close();
  }
});
