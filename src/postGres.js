const pg = require('pg');
require('dotenv').config();
const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "lichessgamedata",
    password: "4312",
    port: "5432"
})
async function userUpload(discord_username, lichess_username, rating, access_token) {
    const upload = await pool.query(`INSERT INTO userdata (discord_username, lichess_username, rating, access_token) VALUES ($1, $2, $3, $4) ON CONFLICT (discord_username) DO UPDATE SET access_token = EXCLUDED.access_token`, [discord_username, lichess_username, rating, access_token])
}
async function userFind(discord_username) {
    const queryResult = await pool.query(`SELECT lichess_username FROM userdata WHERE discord_username = $1`, [discord_username]);
    if (!queryResult.rows[0]) {
        throw new Error('USER_NOT_FOUND');
        console.log(queryResult.rows[0])
    }
    console.log(queryResult.rows[0])
    return (queryResult.rows[0].lichess_username)
}
module.exports = {userUpload}
module.exports = {userFind}


