const {Client, IntentsBitField} = require('discord.js');   
require('dotenv').config();
require('../keep_alive.js');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,   
    ]
})

async function challengeHandler(interaction) {  
    if (!interaction.isCommand()) return;


    if (interaction.commandName === 'create-challenge') {
        const subcommand = interaction.options.getSubcommand();
        const clock = interaction.options.getInteger('clock');
        let increment = interaction.options.getInteger('increment');
        if (increment === null) {
            increment = 0; // Default to 0 if not provided
        }
        const lichessObj = await lichessCall(subcommand, clock, increment)
        await interaction.reply(`${subcommand} match has been created, here is the link ${lichessObj}`)

    }
}

async function lichessCall(sub_command, time, extra_time) {
    const url = `https://lichess.org/api/challenge/open`
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
    return betaResponse.url
    


}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
}); 

client.on('interactionCreate', (interaction) => {
    if (interaction.commandName === 'mame') {
        interaction.reply('sollu mame');
    }
    if (interaction.commandName === 'vanakkam') {
        interaction.reply('vanakkam sollu mame');
    }   
})

client.on('interactionCreate', challengeHandler)

client.login(process.env.DISCORD_TOKEN)