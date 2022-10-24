
import { Pool } from 'pg';

// Load configs
//const ENV_PATH = path.join('..' + path.sep + '..' + path.sep, '.env');
//dotenv.config({path: process.env.ENV_PATH});
// const {
//     POSTGRES_HOST,
//     POSTGRES_DB,
//     POSTGRES_USER,
//     POSTGRES_PASSWORD,
//     POSTGRES_DB_TEST,
//     ENV,
//   } = process.env;
//
let client: Pool;

if(process.env.ENV === 'prod') {
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
    database: process.env.POSTGRES_DB_DEV,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
}

export default client;