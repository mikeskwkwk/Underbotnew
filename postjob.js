const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('postjob')
    .setDescription('Post a new job (Admin only)')
    .addStringOption(o => o.setName('title').setDescription('Job title').setRequired(true))
    .addStringOption(o => o.setName('description').setDescription('Job description').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) return interaction.reply({ content: 'You need Administrator permission to post jobs.', ephemeral: true });

    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const now = Date.now();
    db.run('INSERT INTO jobs(title, description, postedBy, createdAt) VALUES(?,?,?,?)', [title, description, interaction.user.id, now], function(err) {
      if (err) return interaction.reply({ content: 'Error saving job.', ephemeral: true });
      const jobId = this.lastID;
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(process.env.COLOR_PRIMARY || '#007BFF')
        .setFooter({ text: `Job ID: ${jobId} • UnderDevs Bot` });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`apply_${jobId}`).setLabel('Apply').setStyle(ButtonStyle.Success)
      );

      interaction.reply({ embeds: [embed], components: [row] });
    });
  }
};
