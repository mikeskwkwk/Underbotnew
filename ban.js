const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('ban').setDescription('Ban a member (Moderator)').addUserOption(o=>o.setName('target').setDescription('Member to ban').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Reason')),
  async execute(interaction) {
    if (!interaction.member.permissions.has('BanMembers')) return interaction.reply({ content: 'No permission.', ephemeral: true });
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    await interaction.guild.members.ban(user.id, { reason }).catch(err => { return interaction.reply({ content: 'Failed to ban.', ephemeral: true }); });
    interaction.reply({ content: `${user.tag} was banned. Reason: ${reason}` });
  }
};
