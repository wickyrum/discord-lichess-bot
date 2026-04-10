const {Client, IntentsBitField, Embed, MessageFlags} = require('discord.js');   
const {messagePut} = require('./create-tournament.js')
const {loginBack} = require('./server.js')
const {lichessCall} = require('./challengeCreate.js')
const {userFind} = require('./postGres.js')
const {streamGame} = require('../temp.js')
const cron = require('node-cron')
require('dotenv').config();
require('./keep_alive.js');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,   
    ]
})

const helpEmbed = {
    color: 0x0099ff,
    title: 'Helper',
    description: 'lichess-bot commands and usage',
    fields: [
        {
            name: '/create-challenge',
            value: 'Creates a new lichess challenge. Use subcommands to specify the type of challenge (rapid, blitz, bullet) and set the clock and increment times.',
        },
        {
            name: '/help',
            value: 'Displas this help message.',
        },
    ],
}
async function challengeHandler(interaction) {  
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'create-challenge') {
        const challenger = await userFind(interaction.user.username);  
        const chlgDiscord = interaction.options.getUser('user').username; 
        let challenged = undefined;
        try {
            challenged = await userFind(chlgDiscord);
        } catch(error) {
            if (error.message = 'USER_NOT_FOUND') {
                const member = await interaction.guild.members.fetch({ query: chlgDiscord, limit: 1 });
                const user = member.first();
                await interaction.reply(`${user} is not registered in the database. Please register first.`);
                console.log(challenged)
                return;
            }
            throw error;
        }
        const subcommand = interaction.options.getSubcommand();
        const clock = interaction.options.getInteger('clock');
        let increment = interaction.options.getInteger('increment');
        if (increment === null) {
            increment = 0; 
        }
        const lichessObj = await lichessCall(challenged, subcommand, clock, increment);  
        console.log(lichessObj)
        await interaction.reply(`${subcommand} match has been created, here is the link ${lichessObj[0]}`);
        console.log("the challenger is", challenger)
        console.log("the challenged is", challenged)
//        streamGame(lichessObj[1], process.env.LICHESS_TOKEN)
    }

    if (interaction.commandName === 'login') {
        const discord_username = interaction.user.username
        loginBack(discord_username)
        interaction.reply('https://localhost:3002') 

    }

    if (interaction.commandName === 'help') {
        channelid = interaction.channelId
        const channel = await client.channels.fetch(channelid);
        if (!channel) {
            console.error('Channel not found');
            return;
        }
        if (channel.isTextBased()) {
            interaction.reply({ embeds: [helpEmbed] });
        } else {
            console.error('Channel is not a text channel.');
        }
    }
    if (interaction.commandName === 'lichess_login') {
        interaction.reply("you will be shown your way")
    }
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
}); 


client.on('interactionCreate', challengeHandler)

client.login(process.env.DISCORD_TOKEN)
cron.schedule('19 23 * * 3', () => {
    console.log(`[${new Date().toISOString()}] Cron job started`);

    try {
        messagePut();
        console.log(`[${new Date().toISOString()}] Cron job completed successfully`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Cron job failed:`, error);
        console.error('Stack trace:', error.stack);
    }
})
