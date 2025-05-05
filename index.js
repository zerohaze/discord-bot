// Cargar variables solo en desarrollo (Railway ya tiene las suyas)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { Client, GatewayIntentBits } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require('@discordjs/voice');
const path = require('path');

// Revisión de variable TOKEN
if (!process.env.TOKEN || process.env.TOKEN.length < 30) {
  console.error('🚨 TOKEN no válido o no definido. Verifique su variable de entorno.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', () => {
  console.log(`🤖 Bot listo como ${client.user.tag}`);

  const toggleColors = {};

  client.guilds.cache.forEach(async guild => {
    const role = guild.roles.cache.find(r => r.name === 'Nick Peruano');
    if (!role) return;

    toggleColors[guild.id] = true;

    setInterval(async () => {
      try {
        await role.setColor(toggleColors[guild.id] ? '#FF0000' : '#FFFFFF');
        toggleColors[guild.id] = !toggleColors[guild.id];
      } catch (err) {
        console.error(`⚠️ Error cambiando color del rol en ${guild.name}:`, err);
      }
    }, 4000);
  });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong!');
  }

  if (interaction.commandName === 'habla') {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply('❌ Debes estar en un canal de voz');
