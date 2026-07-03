// import winston from 'winston';

// const { combine, timestamp, printf, colorize, errors } = winston.format;

// const logFormat = printf(({ level, message, timestamp, stack }) => {
//   return `${timestamp} [${level}]: ${stack || message}`;
// });

// // const logger = winston.createLogger({
// //   level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
// //   format: combine(
// //     timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
// //     errors({ stack: true }),
// //     logFormat
// //   ),
// //   transports: [
// //     new winston.transports.Console({
// //       format: combine(colorize(), logFormat),
// //     }),
// //     new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
// //     new winston.transports.File({ filename: 'logs/combined.log' }),
// //   ],
// // });

// export default logger;




import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const transports = [
  new winston.transports.Console({
    format: combine(colorize(), logFormat),
  }),
];

// Only write to log files outside production (Railway's filesystem is ephemeral)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports,
});

export default logger;