/**
 * Run `node deploy-commands.js` to register slash commands (useful during testing).
 * Requires CLIENT_ID and TOKEN (and optionally GUILD_ID for guild-scoped registration).
 */

const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId) {
  console.error('Missing TOKEN or CLIENT_ID in environment.');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log('Successfully registered guild commands.');
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('Successfully registered global commands.');
    }
  } catch (error) {
    console.error(error);
  }
})();
