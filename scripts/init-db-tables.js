'use strict';

const path = require('path');
const { promises: fs } = require('fs');
const { Client } = require('pg');

const initSql = path.resolve(__dirname, '..', 'migrations', 'init.sql');

async function main() {
  console.log('Preparing to seed DB');
  const pgClient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  });

  await pgClient.connect();
  console.log('Connected to db');

  const file = await fs.readFile(initSql);
  console.log(`Loaded ${initSql} into memory`);

  await pgClient.query(file.toString());
  console.log('Successfully initialised DB. Closing connection...');

  await pgClient.end();
  console.log('Connection closed. SUCCESS.');
}

main();
