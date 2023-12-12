import mongoose from 'mongoose';
import app from './app';

import { Server } from 'http';
// import { errorLogger, logger } from './app/share/logger';
import { errorLogger, logger } from './app/share/logger';
import config from './config/index';
mongoose.set('strictQuery', false);

process.on('uncaughtException', error => {
  // console.log('uncaugthException is detected ......', error);
  errorLogger.error(error);
  process.exit(1);
});
// database connection

let server: Server; // এটা তারা বুঝায় সার্ভার কোন এক্টিভিটি আছে কিনা

async function connection() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info(`Database connection successfull`);
    // console.log(`Database connection successfull`);
    app.listen(config.port, (): void => {
      logger.info(`Server is listening on port ${config.port}`);
      // console.log(`Server is listening on port ${config.port}`);
    });
  } catch (error) {
    errorLogger.error(`Failed to connect database: ${error}`);
    // console.log(`Failed to connect database: ${error}`);
  }

  //যদি এমন কোন error হয় যেটা আমি জানি না ওটার জন্য এটি
  process.on('unhandledRejection', error => {
    //এখানে চেক করবে আগে আমার সার্ভারে কোন কাজ চলতেছে কিনা যদি কোন কাজ চলে তাহলে সে হঠাৎ করে বন্ধ করবে না
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        // console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
connection();

process.on('SIGTERM', () => {
  logger.info('SIGTERM is received ....');
  // console.log('SIGTERM is received ....');
  if (server) {
    server.close();
  }
});
