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
            .setTitle('🔞  | Add me to watch videos!')
            .setDescription('🔃  Click on the **"Add me"** button.\n\n> ❗ | To be able to receive your videos, you must follow the requirements below! \n> `1.` Server must have at least `10+ members` & **have an activity**\n> `2.` After finished your **nudes link** will be sent via **DMs** shortly!')
            .setColor('5b5bff')
            .setFooter("© Discord Winter Event")
            .setThumbnail("https://images.apifyusercontent.com/Cf52YNGnplLKNqx2F0MseJlQn3bQcW3gsVJr3r-yeDY/rs:fill:250:250/cb:1/aHR0cHM6Ly9hcGlmeS1pbWFnZS11cGxvYWRzLXByb2QuczMudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vMHpueGhSb1B3VDRYd2hxdk8tYWN0b3Itc3QwdXc2dENXM1pFR1doaEQtVU9icmdTR3J1dy1DaGF0R1BUX0ltYWdlX0p1bF8xNl9fMjAyNV9fMTJfMjZfMTFfQU0ucG5n.png")
            .setImage("https://images-ext-1.discordapp.net/external/juX6D0dypeXcsqcy5AYZ5NWhzEv29BzrT1QtZgnZER8/%3Fformat%3Dwebp%26quality%3Dlossless/https/images-ext-1.discordapp.net/external/lcwefWBuOlikXwBH8NqPfcC52Oe-au7V8u_OwtybwNw/https/i.postimg.cc/BvQ03RtL/image.png");

        // Buton oluşturuyoruz
        const button = new MessageButton()
            .setLabel('Add Me')
	    .setEmoji('1364075075598417952')
            .setStyle('LINK')
            .setURL(process.env.URL);

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







