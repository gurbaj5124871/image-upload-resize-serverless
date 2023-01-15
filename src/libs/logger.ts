/*
commenting winston logger due to bug https://github.com/winstonjs/winston/issues/1591
which seems to be resolved but the solution was not working
will create a separate pr for the fix
*/

// import * as Logger from 'winston';

// const { combine, timestamp, label, json, splat } = Logger.format;

// const logger = Logger.createLogger({
//   format: combine(
//     label({ label: process.env.STAGE }),
//     timestamp(),
//     splat(),
//     json()
//   ),
//   transports: [new Logger.transports.Console()]
// });

const logger = console;

export default logger;
