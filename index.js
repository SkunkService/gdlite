const { Client, GatewayIntentBits, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const axios = require('axios');
const { registerCommands } = require('./handlerCommands'); // Ensure this path is correct
const config = require('./config.json');
const TOKEN = config.token;
const GD_API_URL = 'https://gdbrowser.com/api/';  // This is the API URL for GDBrowser.

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    try {
        await client.user.setActivity("Skunk: gd!help", { type: 4 });
        await registerCommands();  // Register commands here
    } catch (error) {
        console.error('Error during bot startup:', error);
    }
});

client.on('error', (error) => {
    console.log('Client encountered an error:', error);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'level' || commandName === 'nivel') {
        const levelId = options.getNumber(commandName === 'level' ? 'levelid' : 'nivelid');
        if (isNaN(levelId) || levelId <= 0) {
            return interaction.reply({
                content: commandName === 'nivel' ? 'Por favor proporciona un ID de nivel válido (entero positivo).' : 'Please provide a valid level ID (positive integer).',
                ephemeral: true
            });
        }

        try {
            const response = await axios.get(`${GD_API_URL}level/${levelId}`);
            const data = response.data;
            const { name = 'N/A', author = 'N/A', difficulty = 'N/A', image_url: imageUrl } = data;

            const embed = new EmbedBuilder()
                .setTitle(commandName === 'nivel' ? `Información del nivel: ${name}` : `Level Info: ${name}`)
                .setDescription(commandName === 'nivel' ? `Autor: ${author}\nDificultad: ${difficulty}` : `Author: ${author}\nDifficulty: ${difficulty}`)
                .setColor('#0099ff');

            if (imageUrl) {
                embed.setImage(imageUrl);
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            // Crear botones
            const yesButton = new ButtonBuilder()
                .setCustomId(commandName === 'nivel' ? 'yes_feedback_es' : 'yes_feedback')
                .setLabel(commandName === 'nivel' ? 'Sí' : 'Yes')
                .setStyle(ButtonStyle.Primary);

            const noButton = new ButtonBuilder()
                .setCustomId(commandName === 'nivel' ? 'no_feedback_es' : 'no_feedback')
                .setLabel(commandName === 'nivel' ? 'No' : 'No')
                .setStyle(ButtonStyle.Secondary);

            // Crear ActionRowBuilder para los botones
            const actionRow = new ActionRowBuilder().addComponents(yesButton, noButton);

            // Enviar el mensaje con los botones
            await interaction.reply({
                content: commandName === 'nivel' ? "Ocurrió un error. Mensaje: El ID de Nivel no existe o el nivel ha sido eliminado." : "An error occurred. Message: The level ID does not exist or the level has been deleted.",
                embeds: [{
                    title: commandName === 'nivel' ? "¿Deseas proporcionar retroalimentación sobre este ID de Nivel?" : "Do you want any Feedback for this Level ID?",
                    description: commandName === 'nivel' ? "El mensaje continúa con el ID del Nivel." : "The Message let continue that the Level ID.",
                }],
                components: [actionRow],
                ephemeral: true
            });
        }
    }

    if (commandName === 'profile') {
        const username = options.getString('username');

        if (!username) {
            return interaction.reply('Please provide a valid Geometry Dash username.');
        }

        try {
            const response = await axios.get(`https://gdbrowser.com/api/user/${username}`);
            const data = response.data;
            const { name = 'N/A', id: userId = 'N/A', profile_image_url: profileImageUrl } = data;

            const embed = new EmbedBuilder()
                .setTitle(`Profile Info: ${name}`)
                .setDescription(`User ID: ${userId}`)
                .setColor('#00ff00');

            if (profileImageUrl) {
                embed.setThumbnail(profileImageUrl);
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply(`Error contacting the Geometry Dash API: ${error.message}`);
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        const userId = '1208633283907158030'; // Reemplaza este valor con el ID del usuario adecuado

        // Verifica si el userId está definido y es un número válido
        if (!userId || isNaN(userId)) {
            console.error('El user_id no es válido:', userId);
            return await interaction.reply({
                content: 'There was an error processing your request.',
                ephemeral: true
            });
        }

        // Convierte el color hexadecimal a entero (sin el símbolo '#')
        const colorHex = 0xffff00; // Color amarillo en hexadecimal

        try {
            const user = await client.users.fetch(userId);

            if (interaction.customId === 'yes_feedback') {
                await user.send({
                    content: `The \`${interaction.user.globalName}\` has sent your feedback or issues.`,
                    embeds: [
                        {
                            title: "Issues and Feedback: ",
                            color: colorHex, // Usar el valor entero para el color
                            description: `${interaction.user.globalName} has sent or reported issues.\nCheck the user here: ${interaction.user.tag}`
                        }
                    ]
                });

                await interaction.reply({
                    content: 'Thank you for choosing to provide feedback!',
                    ephemeral: true
                });
                await interaction.user.send("The SkunkPlatform will review your feedback and issues.");

            } else if (interaction.customId === 'no_feedback') {
                await interaction.reply('Okay, thanks for letting us know.');

            } else if (interaction.customId === 'yes_feedback_es') {
                await user.send({
                    content: `El \`${interaction.user.globalName}\` ha enviado su retroalimentación o problemas.`,
                    embeds: [
                        {
                            title: "Problemas y Retroalimentación: ",
                            color: colorHex, // Usar el valor entero para el color
                            description: `${interaction.user.globalName} ha enviado o reportado problemas.\nVerifica al usuario aquí: ${interaction.user.tag}`
                        }
                    ]
                });

                await interaction.reply({
                    content: '¡Gracias por elegir proporcionar retroalimentación!',
                    ephemeral: true
                });
                await interaction.user.send("El SkunkPlatform revisará su retroalimentación y problemas.");

            } else if (interaction.customId === 'no_feedback_es') {
                await interaction.reply('Está bien, gracias por informarnos.');
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.reply({
                content: 'There was an error processing your request.',
                ephemeral: true
            });
        }
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'gd!help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('Help Commands')
            .setDescription('Here are the available commands:')
            .addFields(
                { name: '!level [id]', value: 'Get information about a level.' },
                { name: '!nivel [id]', value: 'Obten información sobre un nivel.' },
                { name: '!profile [username]', value: 'Search a profile.' },
                { name: '!link-account', value: 'Link your account.' },
                { name: '!linkcode-account [code]', value: 'Link your account using a code.' },
                { name: '!search-profile [username]', value: 'Search for a profile.' }
            )
            .setColor('#0099ff');

        await message.channel.send({ embeds: [helpEmbed] });
    }

    if (command === 'gd!info') {
        await message.reply("**GDLite Bot Information:**\n\nGDLite is a bot designed for Geometry Dash 2.2 in Full Version. It offers utilities for commands and supports both the Full and Lite versions of the game. For more details or commands, please refer to the documentation in this **[Website](https://skunkservice.github.io/gdlite/documentation).**");
    }

    if (command === 'gd!info-es') {
        await message.reply("**Información del Bot GDLite:**\n\nGDLite es un bot diseñado para Geometry Dash 2.2 en la Versión Completa. Ofrece utilidades para comandos y es compatible con las versiones Completa y Lite del juego. Para más detalles o comandos, por favor consulta la documentación en este **[Sitio Web](https://skunkservice.github.io/gdlite/documentation).**");
    }

    if (command === '!level') {
        const levelId = parseInt(args[0], 10);
        if (isNaN(levelId) || levelId <= 0) {
            return message.channel.send('Please provide a valid level ID (positive integer).');
        }

        try {
            const response = await axios.get(`${GD_API_URL}level/${levelId}`);
            const data = response.data;
            const { name = 'N/A', author = 'N/A', difficulty = 'N/A', image_url: imageUrl } = data;

            const embed = new EmbedBuilder()
                .setTitle(`Level Info: ${name}`)
                .setDescription(`Author: ${author}\nDifficulty: ${difficulty}`)
                .setColor('#0099ff');

            if (imageUrl) {
                embed.setImage(imageUrl);
            }

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            // Create a ButtonBuilder instance for each button
            const yesButton = new ButtonBuilder()
                .setCustomId('yes_feedback') // Unique identifier for the "Yes" button
                .setLabel('Yes')
                .setStyle(ButtonStyle.Primary); // Green button style

            const noButton = new ButtonBuilder()
                .setCustomId('no_feedback') // Unique identifier for the "No" button
                .setLabel('No')
                .setStyle(ButtonStyle.Secondary); // Gray button style

            // Create an ActionRowBuilder to hold the buttons
            const actionRow = new ActionRowBuilder().addComponents(yesButton, noButton);

            // Send the message with buttons
            await message.channel.send({
                content: "An error occurred. Message: The level ID does not exist or the level has been deleted.",
                embeds: [{
                    title: "Do you want any Feedback for this Level ID?",
                    description: "The Message let continue that the Level ID.",
                }],
                components: [actionRow],
            });
        }
    }

    if (command === '!nivel') {
        const nivelId = parseInt(args[0], 10);
        if (isNaN(nivelId) || nivelId <= 0) {
            return message.channel.send('Por favor proporciona un ID de nivel válido (entero positivo).');
        }

        try {
            const response = await axios.get(`${GD_API_URL}level/${nivelId}`);
            const data = response.data;
            const { name = 'N/A', author = 'N/A', difficulty = 'N/A', image_url: imageUrl } = data;

            const embed = new EmbedBuilder()
                .setTitle(`Información del nivel: ${name}`)
                .setDescription(`Autor: ${author}\nDificultad: ${difficulty}`)
                .setColor('#0099ff');

            if (imageUrl) {
                embed.setImage(imageUrl);
            }

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            // Crear botones
            const yesButton = new ButtonBuilder()
                .setCustomId('yes_feedback_es')
                .setLabel('Sí')
                .setStyle(ButtonStyle.Primary);

            const noButton = new ButtonBuilder()
                .setCustomId('no_feedback_es')
                .setLabel('No')
                .setStyle(ButtonStyle.Secondary);

            // Crear ActionRowBuilder para los botones
            const actionRow = new ActionRowBuilder().addComponents(yesButton, noButton);

            // Enviar el mensaje con los botones
            await message.channel.send({
                content: "Ocurrió un error. Mensaje: El ID de Nivel no existe o el nivel ha sido eliminado.",
                embeds: [{
                    title: "¿Deseas proporcionar retroalimentación sobre este ID de Nivel?",
                    description: "El mensaje continúa con el ID del Nivel.",
                }],
                components: [actionRow],
            });
        }
    }

    if (command === '!profile') {
        const username = args[0];
        if (!username) {
            return message.channel.send('Please provide a valid Geometry Dash username.');
        }

        try {
            const response = await axios.get(`${GD_API_URL}user/${username}`);
            const data = response.data;
            const { name = 'N/A', id: userId = 'N/A', profile_image_url: profileImageUrl } = data;

            const embed = new EmbedBuilder()
                .setTitle(`Profile Info: ${name}`)
                .setDescription(`User ID: ${userId}`)
                .setColor('#00ff00');

            if (profileImageUrl) {
                embed.setThumbnail(profileImageUrl);
            }

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            await message.channel.send(`Error contacting the Geometry Dash API: ${error.message}`);
        }
    }

    if (command === '!link-account') {
        await message.channel.send('Please provide your authorization code.');
    }

    if (command === '!linkcode-account') {
        const code = args[0];
        try {
            const response = await axios.get(`${GD_API_URL}verify_code/${code}`);
            const data = response.data;
            if (data.status === 'success') {
                await message.channel.send(`Successfully linked account using code: ${code}!`);
            } else {
                await message.channel.send('Invalid code or error linking the account.');
            }
        } catch (error) {
            await message.channel.send('Error contacting the Geometry Dash API.');
        }
    }

    if (command === '!search-profile') {
        const username = args[0];
        if (!username) {
            return message.channel.send('Please provide a valid Geometry Dash username.');
        }

        try {
            const response = await axios.get(`${GD_API_URL}user/${username}`);
            const data = response.data;
            const { name = 'N/A', id: userId = 'N/A', profile_image_url: profileImageUrl } = data;

            const embed = new EmbedBuilder()
                .setTitle(`Profile Info: ${name}`)
                .setDescription(`User ID: ${userId}`)
                .setColor('#00ff00');

            if (profileImageUrl) {
                embed.setThumbnail(profileImageUrl);
            }

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            await message.channel.send(`Error contacting the Geometry Dash API: ${error.message}`);
        }
    }
});

const nameFilters = ["angel ancestral", "you can add filter here"]; // This is the Name Filtered List. This can Protect the Server
const idFilters = []; // This is the Level ID Filtered List.

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Regex para detectar un ID numérico en el mensaje
    const levelIDRegex = /\b\d{1,10}\b/;
    const levelIDMatch = message.content.match(levelIDRegex);

    if (levelIDMatch) {
        const id = levelIDMatch[0];

        // Verificar si el ID está en la lista de filtros
        if (idFilters.includes(id)) {
            await message.channel.send("This Level ID is Denied and Protected for Geometry Dash's Upload Guidelines. You can send a message to Learn More Information: Why is this Level ID Filtered?");
            // Si el usuario pregunta por qué el ID está filtrado
            client.on('messageCreate', async (msg) => {
                if (msg.content === "Why is this Level ID Filtered?") {
                    await msg.reply("This Level ID is filtered due to our guidelines. The GDLite Bot has identified it as violating our rules. You can read more at: https://skunkservice.github.io/gdlite/filtered.");
                } else if (msg.content === "¿Por qué este ID de nivel está filtrado?") {
                    await msg.reply("Este ID de nivel está filtrado debido a nuestras pautas. El bot GDLite lo ha identificado como violador de nuestras reglas. Puedes leer más en: https://skunkservice.github.io/gdlite/filtered.");
                }
            });
            return; // Termina la ejecución para los IDs filtrados
        }

        try {
            // Solicitud GET a la API de GDBrowser
            const response = await axios.get(`https://gdbrowser.com/api/level/${id}`);

            if (response.data && response.data.name) {
                const levelName = response.data.name;
                const creator = response.data.author || 'Unknown';

                // Verificar si el nombre del nivel está filtrado
                const isFiltered = nameFilters.some(filter => levelName.toLowerCase().includes(filter.toLowerCase()));

                if (isFiltered) {
                    const levelMessage = await message.channel.send("This Level Name is Violating our Upload Guidelines. You can send a message to Learn More Information: Why is the Level Name is Protected?");

                    // Si el usuario pregunta por qué el nombre está protegido
                    client.on('messageCreate', async (msg) => {
                        if (msg.content === "Why is the Level Name is Protected?") {
                            await msg.reply("This Level Name is Protected by Geometry Dash's Upload Guidelines. The GDLite Bot will review the name for Dangerous, NSFW Content, Illegal Activities, Inappropriate Name, or Hacking.\nYou can read more at: https://skunkservice.github.io/gdlite/filtered.");
                        } else if (msg.content === "¿Por qué el nombre del nivel está protegido?") {
                            await msg.reply("Este nombre de nivel está protegido por las pautas de carga de Geometry Dash. El bot GDLite revisará el nombre por contenido peligroso, NSFW, actividades ilegales, nombre inapropiado o hackeo.\nPuedes leer más en: https://skunkservice.github.io/gdlite/filtered.");
                        }
                    });
                } else {
                    // Construir embed usando EmbedBuilder si no está filtrado
                    const embed = new EmbedBuilder()
                        .setTitle('Level Found')
                        .setDescription(`Level: ${levelName}\nCreator: ${creator}\nDifficulty: ${response.data.difficulty}`);

                    // Enviar el embed como respuesta
                    message.reply({ embeds: [embed] });
                }
            }
        } catch (error) {
            message.reply(`This Level ID is Invalid.\nError Code: ${error.code}`);
        }
    }
});

const fs = require('fs');
const path = './servers.json';
let servers = [];

// Load servers from file
if (fs.existsSync(path)) {
    const data = fs.readFileSync(path, 'utf8');
    servers = JSON.parse(data) || [];
}

// Function to save servers array to a file
function saveServersToFile() {
    fs.writeFileSync(path, JSON.stringify(servers, null, 2), 'utf8');
}

// Event listener for when the bot is added to a new guild
client.on('guildCreate', async (guild) => {
    console.log("Added my Bot:");
    console.log(`Server Name: ${guild.name}`);
    console.log(`Member Count: ${guild.memberCount || "N/A"}`);

    // Prepare the server data to add to the servers array
    let serverData = {
        id: guild.id,
        verified: false,
        channels: [],
        members: [],
        messages: [],
        roles: []
    };

    // Fetch channels and store in serverData
    guild.channels.cache.forEach(channel => {
        serverData.channels.push({
            id: channel.id,
            name: channel.name,
            type: channel.type
        });
    });

    // Fetch members and their roles
    guild.members.cache.forEach(member => {
        serverData.members.push({
            id: member.id,
            username: member.user.username,
            roles: member.roles.cache.map(role => ({
                id: role.id,
                name: role.name
            }))
        });
    });

    // Fetch messages from each text channel and include attachments and embeds
    for (const channel of guild.channels.cache.values()) {
        if (channel.isTextBased() && channel.viewable) {
            const fetchedMessages = await channel.messages.fetch({ limit: 10 }).catch(() => []); // Fetch recent 10 messages
            fetchedMessages.forEach(message => {
                serverData.messages.push({
                    channelId: channel.id,
                    messageId: message.id,
                    content: message.content,
                    author: message.author.username,
                    timestamp: message.createdTimestamp,
                    attachments: message.attachments.map(attachment => ({
                        id: attachment.id,
                        url: attachment.url,
                        name: attachment.name,
                        size: attachment.size // Size in bytes
                    })),
                    embeds: message.embeds.map(embed => ({
                        title: embed.title || null,
                        description: embed.description || null,
                        url: embed.url || null,
                        color: embed.color || null,
                        fields: embed.fields.map(field => ({
                            name: field.name,
                            value: field.value,
                            inline: field.inline
                        })),
                        footer: embed.footer ? {
                            text: embed.footer.text,
                            icon_url: embed.footer.iconURL
                        } : null,
                        image: embed.image ? {
                            url: embed.image.url
                        } : null,
                        thumbnail: embed.thumbnail ? {
                            url: embed.thumbnail.url
                        } : null,
                        timestamp: embed.timestamp || null,
                        author: embed.author ? {
                            name: embed.author.name,
                            icon_url: embed.author.iconURL,
                            url: embed.author.url
                        } : null
                    }))
                });
            });
        }
    }

    // Fetch roles and store with their permissions and properties
    guild.roles.cache.forEach(role => {
        serverData.roles.push({
            id: role.id,
            name: role.name,
            permissions: role.permissions.toArray(), // Convert permissions to an array
            hoist: role.hoist, // Whether the role is displayed separately
            mentionable: role.mentionable // Whether the role can be mentioned by others
        });
    });

    // Add the new server data to the servers array
    servers.push(serverData);

    // Save the updated servers array to file
    saveServersToFile();

    // Log the updated servers array
    console.log('Updated Servers Array:', servers);

    // Send an embed to the system channel to guide the user on setting up the bot
    if (guild.systemChannel) {
        guild.systemChannel.send({
            embeds: [
                {
                    title: "GDLite Bot Setup",
                    description: "You can allow to setup my Bot by clicking buttons.",
                    color: 0x00ff00 // Example green color
                }
            ]
        }).catch(console.error); // Catch any errors in case the bot lacks permission
    } else {
        console.log("No system channel found or missing permissions to send a message.");
    }
});

client.login(TOKEN);
