const pg = require('pg');
require('dotenv').config();
const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "lichessgamedata",
    password: "4312",
    port: "5432"
})

async function hello() {
    const pello = pool.query("select lichess_username from userdata where discord_username = 'ben_dickt8'").then((data) => console.log(data.rows[0]))
}

hello()
