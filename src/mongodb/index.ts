import mongoose, { Connection, ConnectionOptions } from 'mongoose';

import Logger from 'pino';

export default class Mongo {
  static connection: Connection | null = null;
  protected logger = Logger({ name: 'mongo-logger' });

  constructor(private connectionStr: string, protected options?: ConnectionOptions) {
    if (!options) {
      this.logger.debug('Using default connection options.');
      this.options = {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      };
    }
  }

  async startup(): Promise<Connection> {
    if (Mongo.connection) return Mongo.connection;

    this.logger.info('Attempting to established connection...');

    Mongo.connection = await mongoose.createConnection(this.connectionStr, this.options);
    this.logger.info('Established connection to Mongo.');

    // TODO: Attach models here...

    return Mongo.connection;
  }

  async shutdown(): Promise<void> {
    if (Mongo.connection) {
      this.logger.info('Terminating connection...');

      await Mongo.connection.close();
      Mongo.connection = null;

      this.logger.info('Terminated connection to Mongo.');
    }
  }

  get models() {
    return Mongo.connection?.models;
  }

  static healthCheck(): string {
    return mongoose.STATES[Mongo.connection ? Mongo.connection.readyState : 99];
  }
}
