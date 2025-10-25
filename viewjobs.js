const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder().setName('viewjobs').setDescription('View all active jobs'),
  async execute(interaction) {
    db.all('SELECT * FROM jobs ORDER BY createdAt DESC LIMIT 10', [], (err, rows) => {
      if (err) return interaction.reply({ content: 'Error fetching jobs.', ephemeral: true });
      if (!rows || rows.length === 0) return interaction.reply({ content: 'No jobs found.', ephemeral: true });
      const embed = new EmbedBuilder().setTitle('Available Jobs').setColor(process.env.COLOR_PRIMARY || '#007BFF');
      rows.forEach(r => embed.addFields({ name: `ID ${r.id} — ${r.title}`, value: r.description || 'No description' }));
      interaction.reply({ embeds: [embed] });
    });
  },
};
