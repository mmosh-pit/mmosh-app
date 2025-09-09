import { createClient } from '@clickhouse/client';

export const clickhouse = createClient({
    host: process.env.CLICKHOUSE_HOST || 'http://localhost:9000',
    username: process.env.CLICKHOUSE_USER || 'myuser',
    password: process.env.CLICKHOUSE_PASSWORD || 'mypassword',
    database: process.env.CLICKHOUSE_DB || 'default',
});