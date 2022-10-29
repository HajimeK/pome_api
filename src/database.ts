import { Pool } from 'pg';

let client: Pool;

if (process.env.ENV === 'prod') {
  client = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
} else {
  // otherwise explicitly declared as 'pord' run as ENV === 'test'
  client = new Pool({
    host: process.env.POSTGRES_HOST_TEST,
    database: process.env.POSTGRES_DB_TEST,
    user: process.env.POSTGRES_USER_TEST,
    password: process.env.POSTGRES_PASSWORD_TEST,
  });
}

export default client;
