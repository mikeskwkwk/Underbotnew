const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder().setName('viewapplications').setDescription('View pending applications (Admin)'),
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) return interaction.reply({ content: 'You need Administrator permission to view applications.', ephemeral: true });
    db.all("SELECT applications.id as appId, applications.user, applications.answer, applications.status, jobs.title as jobTitle, applications.createdAt FROM applications LEFT JOIN jobs ON applications.jobId = jobs.id WHERE applications.status = 'Pending' ORDER BY applications.createdAt DESC LIMIT 20", [], async (err, rows) => {
      if (err) return interaction.reply({ content: 'Error fetching applications.', ephemeral: true });
      if (!rows || rows.length === 0) return interaction.reply({ content: 'No pending applications.', ephemeral: true });

      for (const app of rows) {
        const embed = new EmbedBuilder()
          .setTitle(`Application ${app.appId} — ${app.jobTitle}`)
          .setDescription(`User: <@${app.user}>\nAnswer: ${app.answer}`)
          .setFooter({ text: `Submitted: ${new Date(app.createdAt).toLocaleString()}` })
          .setColor(process.env.COLOR_PRIMARY || '#007BFF');

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`accept_${app.appId}`).setLabel('Accept').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`reject_${app.appId}`).setLabel('Reject').setStyle(ButtonStyle.Danger)
        );

        // Send to admin's DM for review
        try { await interaction.user.send({ embeds: [embed], components: [row] }); } catch (e) { console.error('DM error sending application to admin', e); }
      }

      await interaction.reply({ content: 'Sent pending applications to your DMs.', ephemeral: true });
    });
  },
};
