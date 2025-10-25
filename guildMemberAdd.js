module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    // Could send a welcome or instructions here
    try { await member.send('Welcome! Please check the server and verify using the verify button.'); } catch {}
  }
};
