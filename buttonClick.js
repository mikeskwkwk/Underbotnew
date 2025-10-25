const db = require('../database/db');

module.exports = {
  name: 'buttonClick',
  async execute(interaction, client) {
    // Not used directly; interactionCreate forwards to this.
    // Left for compatibility.
  }
};

module.exports.execute = async (interaction, client) => {
  // Apply button: apply_<jobId>
  if (interaction.customId.startsWith('apply_')) {
    const jobId = parseInt(interaction.customId.split('_')[1], 10);
    await interaction.reply({ content: 'I sent you a DM to continue your application. Check your DMs.', ephemeral: true });
    try {
      const user = await interaction.user.createDM();
      await user.send(`You're applying for job ID ${jobId}. Please reply to this message with your application answer (one message). You have 10 minutes.`);
      const filter = m => m.author.id === interaction.user.id;
      const collector = user.createMessageCollector({ filter, max: 1, time: 10 * 60 * 1000 });
      collector.on('collect', msg => {
        db.get('SELECT * FROM jobs WHERE id = ?', [jobId], (err, job) => {
          if (!job) {
            msg.reply('Job not found.');
            return;
          }
          const now = Date.now();
          db.run('INSERT INTO applications(user, jobId, answer, status, createdAt) VALUES(?,?,?,?,?)',
            [interaction.user.id, jobId, msg.content, 'Pending', now], function(err) {
              if (err) {
                msg.reply('There was an error saving your application.');
              } else {
                msg.reply(`Application submitted for **${job.title}** (Application ID: ${this.lastID}). Good luck!`);
              }
            });
        });
      });
      collector.on('end', collected => {
        if (collected.size === 0) {
          try { user.send('You did not send an application answer in time.'); } catch {}
        }
      });
    } catch (e) {
      console.error('DM error:', e);
      try { await interaction.followUp({ content: 'Could not DM you. Please enable DMs from server members.', ephemeral: true }); } catch {}
    }
  }

  // Accept / Reject buttons: accept_<appId> / reject_<appId>
  if (interaction.customId.startsWith('accept_') || interaction.customId.startsWith('reject_')) {
    const parts = interaction.customId.split('_');
    const action = parts[0];
    const appId = parseInt(parts[1], 10);
    const status = action === 'accept' ? 'Accepted' : 'Rejected';

    db.get('SELECT * FROM applications WHERE id = ?', [appId], async (err, app) => {
      if (!app) {
        await interaction.reply({ content: 'Application not found.', ephemeral: true });
        return;
      }
      db.run('UPDATE applications SET status = ? WHERE id = ?', [status, appId], async (err) => {
        try {
          const user = await client.users.fetch(app.user);
          await user.send(`Your application for job ID ${app.jobId} has been **${status}**.`).catch(() => {});
        } catch {}
        await interaction.reply({ content: `Application ${status}.`, ephemeral: true });
      });
    });
  }
};
