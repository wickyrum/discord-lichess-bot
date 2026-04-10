const express = require('express')
const session = require('express-session')
const crypto = require('crypto')
const {userUpload} = require('./postGres.js') 
let server = undefined;
let discord_usernameStore = undefined;
require('dotenv').config();

const app = express()
const clientId = process.env.CLIENT_ID
app.use(session({ resave: true, secret: 'SECRET', saveUninitialized: true }));

app.get('/', (req, res) => {
    res.send('<a href="/login">Login</a>')
})
const base64URLEncode = (str) => { 
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
        console.log(lichessToken.access_token)
        if (!lichessToken.access_token) {
            res.send('Failed getting token');
            return
        }

        const lichessUser = await getLichessUser(lichessToken.access_token)
        console.log(lichessUser.username)
        console.log(lichessUser.id)
        console.log(lichessUser.perfs.rapid.rating)
        res.send(`Logged in as ${lichessUser.username}`)
        userUpload(discord_usernameStore, lichessUser.username, lichessUser.perfs.rapid.rating, lichessToken.access_token)
        server.close()
    }
    catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).send('Authentication failed. Please try again.');
    }
})

async function loginBack(discord_username) {
    server = app.listen(3002, () => console.log('Server has started')) 
    discord_usernameStore = discord_username
}
module.exports = {loginBack}
