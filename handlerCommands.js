const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10'); // Updated to v10
const { clientId, token } = require('./config.json');
const { ApplicationCommandOptionType, ApplicationCommandType } = require('discord-api-types/v10'); // Updated to v10

const rest = new REST({ version: '10' }).setToken(token); // Updated to v10

async function registerCommands() {
    try {
        const commands = [
            {
                name: 'level',
                description: 'Get information about a level.',
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        type: ApplicationCommandOptionType.Number,
                        name: 'levelid',
                        description: 'Type the level ID.',
                        required: true,
                    }
                ]
            },
            {
                name: 'nivel',
                description: 'Obten información sobre un nivel.',
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        type: ApplicationCommandOptionType.Number,
                        name: 'nivelid',
                        description: 'Escribe el ID del nivel.',
                        required: true,
                    }
                ]
            },
            { // This Command Array for /profile it doesn't work.
                name: 'profile',
                description: "Search a profile.",
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        type: ApplicationCommandOptionType.String,  // Corrected type for string input
                        name: 'username',
                        description: 'Write the Username',
                        required: true
                    }
                ]
            }
        ];

        // Register commands globally
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log('Commands registered globally successfully!');
    } catch (error) {
        console.error('Error registering commands:', error.response ? error.response.data : error.message);
    }
}

module.exports = { registerCommands };
