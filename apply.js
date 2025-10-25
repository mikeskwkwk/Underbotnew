const { SlashCommandBuilder } = require('discord.js');
const db = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder().setName('apply').setDescription('Apply for a job by ID').addIntegerOption(o => o.setName('jobid').setDescription('Job ID').setRequired(true)).addStringOption(o => o.setName('answer').setDescription('Your answer').setRequired(true)),
  async execute(interaction) {
    const jobId = interaction.options.getInteger('jobid');
    const answer = interaction.options.getString('answer');
    db.get('SELECT * FROM jobs WHERE id = ?', [jobId], (err, job) => {
      if (!job) return interaction.reply({ content: 'Job not found.', ephemeral: true });
      const now = Date.now();
      db.run('INSERT INTO applications(user, jobId, answer, status, createdAt) VALUES(?,?,?,?,?)', [interaction.user.id, jobId, answer, 'Pending', now], function(err) {
        if (err) return interaction.reply({ content: 'Error saving application.', ephemeral: true });
        interaction.reply({ content: `Application submitted for **${job.title}** (ID: ${this.lastID}).`, ephemeral: true });
      });
    });
  }
};
