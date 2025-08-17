module.exports = {
    name: 'guildDelete',
    once: false,
    async execute(client, guild) {
        client.webhook.send(client.removeGuild(guild));
        function yellow(str) { console.log(`\x1B[43m[!]\x1B[49m \x1B[93m${str}\x1B[39m`) }
        yellow(`Left guild ${guild.name}`)
    }
}