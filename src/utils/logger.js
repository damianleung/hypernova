import winston from 'winston';

let logger = null;

const OPTIONS = {
  level: 'info',
};

const TRANSPORTS_OPTIONS = {
  transports: [
    {
      File: {
        filename: 'winston.log',
      },
    },
  ],
};

const TRANSPORT_METHOD_OPTIONS = {
  File: {
    filename: 'winston.log',
  },
};

const loggerInterface = {
  init(config) {
    const options = Object.assign({}, OPTIONS, config);
    const transportsOptions = Object.assign({}, TRANSPORTS_OPTIONS, config);

    logger = winston.createLogger(options);
    logger.add(new winston.transports.Console({
      level: options.level,
      colorize: true,
      timestamp: true,
      prettyPrint: process.env.NODE_ENV !== 'production',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }));

    transportsOptions.transports.forEach((transport) => {
      const transportConfig = Object.assign({}, TRANSPORT_METHOD_OPTIONS, transport);
      const transportMode = Object.keys(transportConfig)[0];

      logger.add(new winston.transports[transportMode](transport[transportMode]));
    });

    delete loggerInterface.init;
  },

  error(message, meta) {
    return logger.log('error', message, meta);
  },

  info(message, meta) {
    return logger.log('info', message, meta);
  },
};

export default loggerInterface;
