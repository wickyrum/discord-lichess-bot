require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType, AutocompleteInteraction} = require('discord.js');   
const commands = [
    {
        name: 'create-challenge',
        description: 'creates a new lichess-challenge',
        options: [
            {
                name: 'rapid',
                description: 'creates a rapid challenge',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'clock',
                        description: 'sets the clock for the rapid challenge',
                        type: 4,
                        required: true,
                        choices: [
                            {
                                name: '10 minutes',
                                value: 600,
                            },
                            {
                                name: '15 minutes',
                                value: 900,
                            },
                            {
                                name: '20 minutes',
                                value: 1200,
                            }

                        ]
                    },
                    {
                        name: 'increment',
                        description: 'sets the increment for the rapid challenge',
                        type: 4,
                        choices: [
                            {
                                name: '5 seconds',
                                value: 5,
                            },
                            {
                                name: '10 seconds',
                                value: 10,
                            },
                            {
                                name: '15 seconds',
                                value: 15,
                            }

                        ]
                    }
                ]
            },
            {
                name: 'blitz',
                description: 'creates a blitz challenge',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'clock',
                        description: 'sets the clock for the blitz challenge',
                        type: 4,
                        required: true,
                        choices: [
                            {
                                name: '3 minutes',
                                value: 180,
                            },
                            {
                                name: '5 minutes',
                                value: 300,
                            },
                        ]
                    },
                    {
                        name: 'increment',
                        description: 'sets the increment for the blitz challenge',
                        type: 4,
                        choices: [
                            {
                                name: '2 seconds',
                                value: 2,
                            },
                            {
                                name: '3 seconds',
                                value: 3,
                            },
                            {
                                name: '5 seconds',
                                value: 5,
                            }

                        ]
                    }
                ]
            },
           {
                name: 'bullet',
                description: 'creates a bullet challenge',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'clock',
                        description: 'sets the clock for the bullet challenge',
                        type: 4,
                        required: true,
                        choices: [
                            {
                                name: '1 minutes',
                                value: 60
                            },
                            {
                                name: '2 minutes',
                                value: 120,
                            },
                        ]
                    },
                    {
                        name: 'increment',
                        description: 'sets the increment for the bullet challenge',
                        type: 4,
                        choices: [
                            {
                                name: '1 seconds',
                                value: 1,
                            },
                            {
                                name: '2 seconds',
                                value: 2,
                            },
                        ]
                    }
                ]

            }, 
        ],
        
    
    },
    {
        name: 'help',
        description: 'shows the help message',
    },
    {
        name: 'lichess_login',
        description: 'connects your lichess account to the chess bot',
    }
];

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN); 

(async () => {
    try {
        console.log('starting putting commands')
        await rest.put( Routes.applicationCommands(process.env.BOT_ID), {body: commands})
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.log(error);
    }
})()
