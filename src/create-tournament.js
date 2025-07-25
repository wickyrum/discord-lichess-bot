require('dotenv').config();
const cron = require('node-cron')
console.log(cron.schedule)
const { Client, IntentsBitField } = require('discord.js');


const lichess_post_url = `https://lichess.org/api/swiss/new/${process.env.TEAM_ID}`
const start_time = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes from now
const data = {
    "name": "Friendly Rapid Showdown",
    "clock.limit": 600,
    "clock.increment": 3,
    "nbRounds": 3,
    "startsAt": start_time,
    "roundInterval": 45,    
    "variant": "standard",
    "description": "A fun rapid event for team members!",
    "rated": "true"
}

const headers = {
    "Authorization": `Bearer ${process.env.LICHESS_TOKEN}`,
    "Content-Type": "application/x-www-form-urlencoded"
}
async function createTournament() {
    const response = await fetch(lichess_post_url, {
        method: 'POST',
        headers: headers,
        body: new URLSearchParams(data)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error creating tournament:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Tournament created successfully:', result);
    return result;
}

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,   
    ]
})


async function messagePut() {
    const tourney = await createTournament();
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (channel && channel.isTextBased()) {
        await channel.send(`${tourney.name} starts in thirty minutes! Here is the link to the tournament: https://lichess.org/swiss/${tourney.id}`);
    } else {
        console.error('Channel not found or is not a text channel.');
    }
}
client.login(process.env.DISCORD_TOKEN)
module.exports = {messagePut}
