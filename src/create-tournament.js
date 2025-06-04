require('dotenv').config();
const cron = require('node-cron')
const { Client, IntentsBitField } = require('discord.js');


const lichess_post_url = `https://lichess.org/api/swiss/new/${process.env.TEAM_ID}`
const start_time = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes from now
const data = {
    "name": "Friendly Rapid Showdown",
    "clock.limit": 15,
    "clock.increment": 3,
    "nbRounds": 3,
    "startsAt": start_time,
    "roundInterval": 45,    
    "variant": "standard",
    "description": "A fun blitz event for team members!",
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
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log("hello word2")
    cron.schedule("30 1 * * 0", messagePut);
   })


async function messagePut() {
    const tourney = await createTournament();
    console.log("tournament called")
    const channelId = "959416923878195202"
    const channel = await client.channels.fetch(channelId);
    console.log(channel)
    console.log("channel fetched")
    channel.send("hello world I come from a js script")
    if (channel && channel.isTextBased()) {
        await channel.send(`${tourney.name} starts in thirty minutes! Here is the link to the tournament: https://lichess.org/swiss/${tourney.id}`);
        process.exit(0); // Exit the process after sending the message
        console.log("gotta exit")
    } else {
        console.error('Channel not found or is not a text channel.');
 
    }
}
function hello() {
    console.log("helo 123")
}
client.login(process.env.DISCORD_TOKEN)
