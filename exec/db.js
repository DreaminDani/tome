const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TARGET_URI });

// remove all data within all tables (needs to update as we add more tables)
pool.query('TRUNCATE artifacts, session, users', (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log(res.rows[0]);
  }
});
