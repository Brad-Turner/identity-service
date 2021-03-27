import mongoose, { Connection, ConnectionOptions } from 'mongoose';

export default class Mongo {
  static connection: Connection | null = null;

  constructor(private connectionStr: string, protected options?: ConnectionOptions) {
    if (!options) {
      this.options = {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      };
    }
  }

  async startup(): Promise<Connection> {
    if (Mongo.connection) return Mongo.connection;

    console.log('Connecting to MongoDB:', this.connectionStr);
    Mongo.connection = await mongoose.createConnection(this.connectionStr, this.options);

    console.log('Successfully connected to MongoDB!!!');

    // TODO: Attach models here...

    return Mongo.connection;
  }

  async shutdown(): Promise<void> {
    if (Mongo.connection) {
      await Mongo.connection.close();
      Mongo.connection = null;
    }
  }

  get models() {
    return Mongo.connection?.models;
  }

  static healthCheck(): string {
    return mongoose.STATES[Mongo.connection ? Mongo.connection.readyState : 99];
  }
}
