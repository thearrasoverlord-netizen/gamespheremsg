const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra la latencia del bot')
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registrando comandos...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Comandos registrados.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Conectado como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        const latency = client.ws.ping;

        await interaction.reply(`🏓 Pong! Lat: ${latency} ms`);
    }
});

client.login(process.env.TOKEN);
