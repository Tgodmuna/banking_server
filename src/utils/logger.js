const winston = require("winston");
const { combine, colorize, align, timestamp, printf, json } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "'YYYY-MM-DD hh:mm:ss.SSS A" }),
    align(),
    json(),
    printf((value) => {
      return `
    LEVEL:${value.level},
    TIMESTAMP:${value.timestamp},
     MESSAGE:${value.message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "general.log" }),
    new winston.transports.File({ filename: "errors.log", level: "warn" }),
  ],
});

module.exports = logger;
