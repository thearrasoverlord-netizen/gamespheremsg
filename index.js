require('dotenv').config();
const { Client, GatewayIntentBits, Partials, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');

// ---------------- EXPRESS SERVER PARA UPTIMEROBOT ----------------
const app = express();
app.get('/', (req, res) => res.send('Bot awake!'));
const PORT = 3000;
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));

// ---------------- CLIENT DE DISCORD ----------------
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ---------------- SLASH COMMANDS ----------------
const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the bot latency'),
    new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Sends you the welcome message via DM')
].map(command => command.toJSON());

// REGISTRAR COMANDOS EN TU GUILD (reemplaza GUILD_ID por tu servidor)
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// ---------------- EMBED DE BIENVENIDA ----------------
function getWelcomeEmbed() {
    return new EmbedBuilder()
        .setTitle('🚀🔥 WELCOME TO GAME SPHERE 🔥🚀')
        .setDescription(`Think you’ve got what it takes? 👀
This isn’t just a server… it’s a battle arena for legends.

🎮 Game Sphere is where gamers unite to:
💥 Flex insane scores
🏆 Dominate weekly events
⚔️ Compete in epic challenges
🎉 Chill, vibe, and squad up

🟩 Minecraft
🌐 .io Games
🎮 Roblox
…and more!

💎 Why join?
• Active & hype community
• Weekly competitions & rewards
• Fun events that actually slap
• New friends, new rivals, new legends

So what are you waiting for? Just invite your friends! 👉 https://discord.gg/c7C5D7cYbU`)
        .setColor('Blurple');
}

// ---------------- EVENTO BIENVENIDA ----------------
client.on('guildMemberAdd', async (member) => {
    try {
        await member.send({ embeds: [getWelcomeEmbed()] });
        console.log(`Sent welcome DM to ${member.user.tag}`);
    } catch (err) {
        console.log(`Could not send DM to ${member.user.tag}`);
    }
});

// ---------------- EVENTO SLASH COMMANDS ----------------
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply(`🏓 Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms`);
    }

    if (interaction.commandName === 'dm') {
        try {
            await interaction.user.send({ embeds: [getWelcomeEmbed()] });
            await interaction.reply({ content: '✅ I just sent you a DM!', ephemeral: true });
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: '❌ I could not DM you. Do you have DMs disabled?', ephemeral: true });
        }
    }
});

// ---------------- LOGIN ----------------
client.login(process.env.TOKEN);

client.once('ready', () => {
    console.log(`Bot ready! Logged in as ${client.user.tag}`);
});
