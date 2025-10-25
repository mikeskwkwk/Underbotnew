module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction, client);
      } else if (interaction.isButton()) {
        const handler = require('./buttonClick.js');
        await handler.execute(interaction, client);
      }
    } catch (err) {
      console.error('Interaction error:', err);
      if (interaction.replied || interaction.deferred) {
        try { await interaction.followUp({ content: 'There was an error executing this.', ephemeral: true }); } catch {}
      } else {
        try { await interaction.reply({ content: 'There was an error executing this.', ephemeral: true }); } catch {}
      }
    }
  }
};
