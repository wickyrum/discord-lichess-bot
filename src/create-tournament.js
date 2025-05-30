require('dotenv').config();
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
    // console.log('Tournament created successfully:', result);
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
    const tourney = await createTournament();
    const channelId = '959416923878195202';
    const channel = await client.channels.fetch(channelId);
    if (channel && channel.isTextBased()) {
        channel.send(`${tourney.name} starts in thirty minutes! Here is the link to the tournament: https://lichess.org/swiss/${tourney.id}`);
        process.exit(0)
    } else {
        console.error('Channel not found or is not a text channel.');
    }
});

client.login(process.env.DISCORD_TOKEN)