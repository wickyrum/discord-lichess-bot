const express = require('express')
const session = require('express-session')
const crypto = require('crypto')
const pg = require('pg');
const discord_username = require('./index.js')
require('dotenv').config();

const app = express()
const port = process.env.PORT
const clientId = process.env.CLIENT_ID

app.use(session({ resave: true, secret: 'SECRET', saveUninitialized: true }));

app.get('/', (req, res) => {
    res.send('<a href="/login">Login</a>')
})

// /login
const base64URLEncode = (str) => {  //encodes a string to be a proper base64URL
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest(); //hashes any given string
const createVerifier = () => base64URLEncode(crypto.randomBytes(32));  //creates a random string + encodes it to be base64URL
const createChallenge = (verifier) => base64URLEncode(sha256(verifier)); //hashes the randomly created createVerifier string

app.get('/login', async (req, res) => {
    const url = req.protocol + '://' + req.get('host') + req.baseUrl;
    const verifier = createVerifier()
    const challenge = createChallenge(verifier)
    req.session.codeVerifier = verifier
    res.redirect('https://lichess.org/oauth?' + new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: `${url}/callback`,
        scope: 'challenge:write',
        code_challenge_method: 'S256',
        code_challenge: challenge
    }))
})

// CALLBACK
const getLichessToken = async (authCode, verifier, url) => await fetch('https://lichess.org/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        grant_type: 'authorization_code',
        redirect_uri: `${url}/callback`,
        client_id: clientId,
        code: authCode,
        code_verifier: verifier,
    })
}).then(res => res.json());
const getLichessUser = async (accessToken) => await fetch('https://lichess.org/api/account', {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
}).then(res => res.json());

app.get('/callback', async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get('host') + req.baseUrl;
        const verifier = req.session.codeVerifier;
        const lichessToken = await getLichessToken(req.query.code, verifier, url)
        console.log(lichessToken)
        console.log(lichessToken.access_token)
        if (!lichessToken.access_token) {
            res.send('Failed getting token');
            return
        }

        const lichessUser = await getLichessUser(lichessToken.access_token)
        res.send(`Logged in as ${lichessUser.username}`)
        dbUpload(lichessUser.id, lichessToken.access_token)
    }
    catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).send('Authentication failed. Please try again.');
    }
})

async function dbUpload(discord_username, lichessId, accessToken) {
    const pool = new pg.Pool({
        user: "postgres",
        host: "localhost",
        database: "lichessbot",
        password: "lol",
        port: 5432,
    });
    console.log(discord_username, lichessId, accessToken)
    await pool.query(`insert into base (discord_username, lichess_username, access_token) values ($1, $2, $3)`, [discord_username, lichessId, accessToken])

}
app.listen(process.env.PORT)
