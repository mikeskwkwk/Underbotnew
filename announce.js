const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder().setName('announce').setDescription('Send an announcement embed (Admin)').addChannelOption(o=>o.setName('channel').setDescription('Target channel').setRequired(true)).addStringOption(o=>o.setName('message').setDescription('Announcement message').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) return interaction.reply({ content: 'No permission.', ephemeral: true });
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');
    const embed = new EmbedBuilder().setTitle('Announcement').setDescription(message).setColor(process.env.COLOR_PRIMARY || '#007BFF').setFooter({ text: 'UnderDevs Bot' });
    await channel.send({ embeds: [embed] });
    interaction.reply({ content: 'Announcement sent.', ephemeral: true });
  }
};
