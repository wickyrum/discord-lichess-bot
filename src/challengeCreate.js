const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const {streamGame} = require('../temp.js')
require('dotenv').config();
async function lichessCall(challenged, sub_command, time, extra_time) {
    const url = `https://lichess.org/api/challenge/${challenged}`
    const header = {
        'Authorization': `Bearer ${process.env.LICHESS_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    const data = new URLSearchParams({
        'name': `${sub_command} challenge`,
        'clock.limit': time,
        'clock.increment': extra_time,
    });
    const alphaResponse = await fetch(url, {
        method: 'POST',
        headers: header,
        body: data,
    })
    const betaResponse = await alphaResponse.json()
    console.log(betaResponse.url)
    console.log(betaResponse)
    return [betaResponse.url, betaResponse.id];
}

module.exports = {lichessCall}
// const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

