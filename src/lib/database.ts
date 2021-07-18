import 'reflect-metadata';
import { getConnection, createConnection, Connection } from 'typeorm';
import { EmailQueue } from '../entities/EmailQueue';
import { Product } from '../entities/Product';
import { User } from '../entities/User';

const host = process.env.DATABASE_HOST || '';
const port = Number(process.env.DATABASE_PORT) || 5432;
const username = process.env.DATABASE_USERNAME || '';
const password = process.env.DATABASE_PASSWORD || '';
const database = process.env.DATABASE_NAME || '';

let connectionReadyPromise: Promise<Connection> | null = null;

export const prepareConnection = () => {
  if (!connectionReadyPromise) {
    connectionReadyPromise = (async () => {
      // clean up old connection that references outdated hot-reload classes
      try {
        const staleConnection = getConnection();
        await staleConnection.close();
      } catch {}

      // wait for new default connection
      const connection = await createConnection({
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        entities: [EmailQueue, User, Product],
        synchronize: false,
        logging: true
      });

      return connection;
    })();
  }

  return connectionReadyPromise;
};
