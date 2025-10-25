const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('kick').setDescription('Kick a member (Moderator)').addUserOption(o=>o.setName('target').setDescription('Member to kick').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Reason')),
  async execute(interaction) {
    if (!interaction.member.permissions.has('KickMembers')) return interaction.reply({ content: 'No permission.', ephemeral: true });
    const user = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(()=>null);
    if (!member) return interaction.reply({ content: 'Member not found.', ephemeral: true });
    const reason = interaction.options.getString('reason') || 'No reason provided';
    await member.kick(reason).catch(err => { return interaction.reply({ content: 'Failed to kick.', ephemeral: true }); });
    interaction.reply({ content: `${user.tag} was kicked. Reason: ${reason}` });
  }
};
