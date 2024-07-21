const e = require('express');
const { Client } = require('pg');

const clients = {
    5432 : new Client({
      user: "postgres",
      host: "localhost",
      database: "postgres",
      password: "postgres",
      port: 5432,
    }),
    5433: new Client({
      user: "postgres",
      host: "localhost",
      database: "postgres",
      password: "postgres",
      port: 5433,
    }),
    5434: new Client({
      user: "postgres",
      host: "localhost",
      database: "postgres",
      password: "postgres",
      port: 5434,
    }),
  };

  exports.clients = clients;