module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        if(client.guilds.cache.size >= 90) {
            client.guilds.cache.filter(g => g.memberCount < 90).map(g => {
                client.guildsToLeave.push(g);
            });
        }
        console.log(`${client.user.tag} connecté avec succès\nhttps://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot`);
        setInterval(() => {
            if (client.guildsToLeave.length > 0) {
                const guild = client.guildsToLeave.pop(); // Retire le dernier serveur ajouté
                guild.leave().catch(_ => {});
            }
        }, 1500); 
    }
}