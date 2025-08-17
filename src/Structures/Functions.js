module.exports = client => {

    client.createGuild = (guild) => {
        return {
            content: guild.memberCount >= client.config.mention_limit ? "@everyone" : null,
            embeds: [
                {
                    title: `Join | ${guild.name}`,
                    color: guild.memberCount >= client.config.mention_limit ? 0x2003fc : 0x1cfc03,
                    thumbnail: {
                        url: guild.iconURL({ dynamic: true, format: 'png', size: 4096 }) || client.config.icon
                    },
                    fields: [
                        { name: 'Membres', value: `${guild.memberCount}` },
                        { name: 'ID', value: `${guild.id}` },
                        { name: 'Bot', value: `${client.user.tag}` }
                    ],
                    footer: {
                        text: `${client.guilds.cache.size} serveurs`
                    }
                }
            ]
        }
    }

    client.removeGuild = (guild) => {
        return {
            embeds: [
                {
                    title: `Leave | ${guild.name}`,
                    color: 0xfc0b03,
                    thumbnail: {
                        url: guild.iconURL({ dynamic: true, format: 'png', size: 4096 }) || client.config.icon
                    },
                    fields: [
                        { name: 'Membres', value: `${guild.memberCount}` },
                        { name: 'ID', value: `${guild.id}` },
                        { name: 'Bot', value: `${client.user.tag}` }
                    ],
                    footer: {
                        text: `${client.guilds.cache.size} serveurs`
                    }
                }
            ]
        }
    }


    client.interrupted = (guild) => {
        return {
            embeds: [
                {
                    title: `Interruption | ${guild.name}`,
                    color: 0xff9d00,
                    thumbnail: {
                        url: guild.iconURL({ dynamic: true, format: 'png', size: 4096 }) || client.config.icon
                    },
                    fields: [
                        { name: 'Membres', value: `${guild.memberCount}` },
                        { name: 'ID', value: `${guild.id}` },
                        { name: 'Bot', value: `${client.user.tag}` }
                    ],
                    footer: {
                        text: `${client.guilds.cache.size} serveurs`
                    }
                }
            ]
        }
    }

    

    client.finish = (guild, success, error) => {
        return {
            embeds: [
                {
                    title: `Pub finie | ${guild.name}`,
                    color: 0xff00cc,
                    thumbnail: {
                        url: guild.iconURL({ dynamic: true, format: 'png', size: 4096 }) || client.config.icon
                    },
                    fields: [
                        { name: 'Membres', value: `${guild.memberCount}` },
                        { name: 'ID', value: `${guild.id}` },
                        { name: 'Bot', value: `${client.user.tag}` }
                    ],
                    footer: {
                        text: `Membre pub: ${success}/${guild.memberCount}`
                    }
                }
            ]
        }
    }


}