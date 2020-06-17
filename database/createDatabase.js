const {
    Pool
} = require('pg')
var connectionString = {
    connectionString: process.env.DATABASE_URL,
    ssl: true
};

const pool = new Pool(connectionString);

module.exports = pool