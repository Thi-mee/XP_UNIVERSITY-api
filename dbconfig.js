const Pool = require('pg').Pool;

const pgConn = {
  user: 'postgres',
  host: '192.168.17.220',
  database: 'Academics',
  scheme: 'AcadSchema',
  password: 's3alt3am',
  port: 5432,
};



const pool = new Pool(pgConn);
module.exports = pool;