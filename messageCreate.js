const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;
    // Example: admin can send '!setupverify' to create a verify message with button (for convenience)
    if (message.content === '!setupverify' && message.member.permissions.has('Administrator')) {
      const embed = new EmbedBuilder().setTitle('Verify').setDescription('Click the button to verify and get the Verified role.').setColor(process.env.COLOR_PRIMARY || '#007BFF');
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('verify_button').setLabel('Verify').setStyle(ButtonStyle.Primary)
      );
      await message.channel.send({ embeds: [embed], components: [row] });
    }

    if (message.content === '!ticket' && message.member.permissions.has('Administrator')) {
      const embed = new EmbedBuilder().setTitle('Open Ticket').setDescription('Click the button to open a support ticket.').setColor(process.env.COLOR_PRIMARY || '#007BFF');
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('open_ticket').setLabel('Open Ticket').setStyle(ButtonStyle.Secondary)
      );
      await message.channel.send({ embeds: [embed], components: [row] });
    }
  }
};
