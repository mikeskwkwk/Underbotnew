const { SlashCommandBuilder } = require('discord.js');
const db = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder().setName('setup').setDescription('Set bot settings (Admin)').addStringOption(o=>o.setName('key').setDescription('setting key, e.g., verifyRole, jobChannel').setRequired(true)).addStringOption(o=>o.setName('value').setDescription('value, e.g., roleId or channelId').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) return interaction.reply({ content: 'No permission.', ephemeral: true });
    const key = interaction.options.getString('key');
    const value = interaction.options.getString('value');
    db.run('INSERT OR REPLACE INTO settings(key, value) VALUES(?,?)', [key, value], (err) => {
      if (err) return interaction.reply({ content: 'Error saving setting.', ephemeral: true });
      interaction.reply({ content: `Setting saved: ${key} = ${value}`, ephemeral: true });
    });
  }
};
