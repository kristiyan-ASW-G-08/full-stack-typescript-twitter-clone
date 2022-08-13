import { createLogger, format, transports } from 'winston';

const { combine, timestamp, colorize, prettyPrint } = format;
const { File, Console } = transports;

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), prettyPrint(), colorize()),
  transports: [new Console({ format: format.simple() })],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new Console({
      format: format.simple(),
    }),
  );
}

export default logger;
