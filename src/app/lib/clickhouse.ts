import { createClient } from '@clickhouse/client';

export const clickhouse = createClient({
    url: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || 'mypassword',
    database: process.env.CLICKHOUSE_DB || 'default',
});