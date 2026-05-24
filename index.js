const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const express = require("express");
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Bot is online!");
});

app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`);
});

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the bot latency')
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Slash commands registered successfully.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        const latency = client.ws.ping;

        await interaction.reply(
`🏓 Pong!
-# Lat: ${latency} ms.`
        );
    }
});

client.login(process.env.TOKEN);
