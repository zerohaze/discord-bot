require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Responde Pong!'),
  new SlashCommandBuilder().setName('habla').setDescription('Reproduce un audio en el canal de voz'),
  new SlashCommandBuilder().setName('nomorire').setDescription('Activa la inmortalidad suprema del bot'),
  new SlashCommandBuilder().setName('nickperuano').setDescription('Activa el nick con los colores mas peruanos q exista'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🛠️ Subiendo comando slash...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log('✅ Comando subido con éxito.');
  } catch (error) {
    console.error('🚨 Error al subir comando:', error);
  }
})();


