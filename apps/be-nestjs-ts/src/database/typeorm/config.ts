import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { SeederOptions } from "typeorm-extension";

dotenv.config();

const source: DataSourceOptions & SeederOptions = {
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: +(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        join(__dirname, '..', '**', '*.entity.{js,.ts}'),
    ],
    seeds: [join(__dirname, 'seeds', '**', '*.seed.{js,ts}')],
    factories: [join(__dirname, 'factories', '**', '*.factory.{js,ts}')],
    synchronize: false,
    migrations: [join(__dirname, 'migrations', '**', '/*{js,ts}')],
};

const devDataSource = new DataSource(source);

export default devDataSource;
