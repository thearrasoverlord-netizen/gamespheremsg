// Carga variables de entorno desde .env
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

// Crear cliente con permisos básicos
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// Tomar token desde variable de entorno
const TOKEN = process.env.TOKEN;

// Evento cuando el bot esté listo
client.once('ready', () => {
    console.log(`Bot listo! Conectado como ${client.user.tag}`);
});

// Comando básico: !ping
client.on('messageCreate', message => {
    if(message.author.bot) return; // Ignorar bots
    if(message.content === '!ping') {
        message.reply('Pong!');
    }
});

// Iniciar sesión
client.login(TOKEN);
