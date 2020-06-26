import knex from 'knex';
import path from 'path';

const sqliteConfig = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true
}

const mssqlConfig = {
    client: 'mssql',
    connection: {
        host: '127.0.0.1',
        database: 'NLW',
        options: {
            trustedConnection: true
        }
    }
}

const connection = knex(sqliteConfig);

export default connection;