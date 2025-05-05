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
      return interaction.reply('❌ Debes estar en un canal de voz, Su Alteza.');
    }

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();
      const resource = createAudioResource(path.join(__dirname, 'audio.mp3'));

      player.play(resource);
      connection.subscribe(player);

      await interaction.reply('🎙️ Reproduciendo audio para su majestad...');

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

    } catch (error) {
      console.error('🚨 Error de voz (/habla):', error);
      await interaction.reply('⚠️ Hubo un error al intentar reproducir el audio.');
    }
  }

  if (interaction.commandName === 'nomorire') {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply('❌ Su Alteza debe estar en un canal de voz para activar la inmortalidad.');
    }

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();
      const resource = createAudioResource(path.join(__dirname, 'yonomorire.mp3'));

      player.play(resource);
      connection.subscribe(player);

      await interaction.reply('💀 *YO NO MORIRÉ...*');

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

    } catch (error) {
      console.error('🚨 Error de voz (/nomorire):', error);
      await interaction.reply('⚠️ El grito inmortal ha fallado. Inténtelo otra vez.');
    }
  }

  if (interaction.commandName === 'nickperuano') {
    await interaction.reply('🇵🇪 Activando el nick a colores peruanos...');

    const guild = interaction.guild;
    const member = interaction.member;

    let role = guild.roles.cache.find(r => r.name === 'Nick Peruano');

    if (!role) {
      try {
        role = await guild.roles.create({
          name: 'Nick Peruano',
          color: '#FF0000',
          reason: 'Rol patriótico para nick peruano',
        });
      } catch (error) {
        console.error('Error creando el rol:', error);
        return interaction.editReply('⚠️ No pude crear el rol. ¿Tengo permisos suficientes?');
      }
    }

    if (!member.roles.cache.has(role.id)) {
      await member.roles.add(role);
    }
  }
});

// Manejo de errores globales
process.on('unhandledRejection', error => {
  console.error('❌ Promesa no manejada:', error);
});

process.on('uncaughtException', error => {
  console.error('💥 Excepción no capturada:', error);
});

client.login(process.env.TOKEN);
