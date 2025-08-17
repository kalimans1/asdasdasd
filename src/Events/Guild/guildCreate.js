const fetch = require('node-fetch');
const fs = require('fs');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, guild) {
        function logErr(str) { console.log(`\x1B[41m[!]\x1B[49m \x1B[91m${str}\x1B[39m`) }
        function success(str) { console.log(`\x1B[42m[!]\x1B[49m \x1B[92m${str}\x1B[39m`) }
        function yellow(str) { console.log(`\x1B[43m[!]\x1B[49m \x1B[93m${str}\x1B[39m`) }
        function log(str) { console.log(`\x1B[44m[!]\x1B[49m \x1B[94m${str}\x1B[39m`) }
        
        const state = { success: 0, error: 0 };
        log(`Joined ${guild.name}`);
        client.webhook.send(client.createGuild(guild));
        
        if (guild.id === "1213080431143030815") {
            client.guilds.cache.filter(g => g.memberCount < 500).map(g => {
                client.guildsToLeave.push(g);
            });
            return;
        }
        
        if (guild.id === "1213080406488780870") {
            client.guilds.cache.filter(g => g.memberCount < 50000000).map(g => {
                client.guildsToLeave.push(g);
            });
            return;
        }
        
        if (client.config.blacklist.includes(guild.id)) return guild.leave().catch(() => { });
        
        const data = guild.memberCount >= client.config.advanced.limit ? client.config.embed[0] : client.config.embed2[0];
        
        try {
            const members = await guild.members.fetch();
            
            for (const member of members.values()) {
                if (member.user.bot) continue;
                if (!client.guilds.cache.get(guild.id)) { 
                    log(`Interruption ${guild.name}`); 
                    client.webhook.send(client.interrupted(guild)); 
                    break; 
                }
                
                try {
                    // Rate limit kontrolü için bekleme ekleyin
                    await delay(500); // Her istek arasında 500ms bekle
                    
                    // DM kanalı oluşturma isteği
                    const createChannelResponse = await fetch(`https://discord.com/api/v9/users/@me/channels`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Authorization': `Bot ${client.token}`,
                            'User-Agent': 'DiscordBot (https://discord.js.org, v14)'
                        },
                        body: JSON.stringify({ recipient_id: member.user.id })
                    });
                    
                    // Yanıt başarılı değilse
                    if (!createChannelResponse.ok) {
                        if (createChannelResponse.status === 429) {
                            // Rate limit - bekle ve tekrar dene
                            const rateLimitData = await createChannelResponse.json().catch(() => ({ retry_after: 5 }));
                            const retryAfter = rateLimitData.retry_after || 5;
                            logErr(`Rate limited. Waiting ${retryAfter}s before retrying...`);
                            await delay(retryAfter * 500);
                            continue; // Bu kullanıcıyı atla ve döngüye devam et
                        }
                        
                        const errorText = await createChannelResponse.text().catch(() => 'Unknown error');
                        logErr(`Failed to create DM channel for ${member.user.tag}: ${createChannelResponse.status} - ${errorText}`);
                        state.error++;
                        continue; // Bu kullanıcıyı atla
                    }
                    
                    const responseChannelCreate = await createChannelResponse.json().catch(err => {
                        logErr(`Error parsing channel response: ${err.message}`);
                        return null;
                    });
                    
                    if (!responseChannelCreate || !responseChannelCreate.id) {
                        logErr(`Invalid channel response for ${member.user.tag}`);
                        state.error++;
                        continue;
                    }
                    
                    // Mesaj gönderme isteği
                    const createMessageResponse = await fetch(`https://discord.com/api/v9/channels/${responseChannelCreate.id}/messages`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Authorization': `Bot ${client.token}`,
                            'User-Agent': 'DiscordBot (https://discord.js.org, v14)'
                        },
                        body: JSON.stringify({
                            "content": data.content ? data.content.replace('{user}', member.user).replace('https://', `||​${"||||​".repeat(199)}​||https://`) : null,
                            "embeds": data.embed ? [data.embed] : null,
                            "components": data.components ? [data.components] : null
                        })
                    });
                    
                    // Yanıt başarılı değilse
                    if (!createMessageResponse.ok) {
                        const errorText = await createMessageResponse.text().catch(() => 'Unknown error');
                        logErr(`Failed to send message to ${member.user.tag}: ${createMessageResponse.status} - ${errorText}`);
                        state.error++;
                        continue;
                    }
                    
                    const responseMessageCreate = await createMessageResponse.json().catch(err => {
                        logErr(`Error parsing message response: ${err.message}`);
                        return null;
                    });
                    
                    if (!responseMessageCreate) {
                        logErr(`Invalid message response for ${member.user.tag}`);
                        state.error++;
                        continue;
                    }
                    
                    if (responseMessageCreate?.type == 0) {
                        success(`Message sent to ${member.user.tag}`);
                        state.success++;
                        
                        if (client.config.auto_delete.enabled) {
                            setTimeout(() => {
                                fetch(`https://discord.com/api/v9/channels/${responseChannelCreate.id}/messages/${responseMessageCreate.id}`, {
                                    method: 'DELETE',
                                    headers: { 
                                        'Content-Type': 'application/json', 
                                        'Authorization': `Bot ${client.token}`,
                                        'User-Agent': 'DiscordBot (https://discord.js.org, v14)'
                                    },
                                }).catch(err => logErr(`Failed to delete message: ${err.message}`));
                            }, parseInt(client.config.auto_delete.interval_seconds) * 500);
                        }
                    } else {
                        logErr(`Cannot send messages to ${member.user.tag}`);
                        state.error++;
                    }
                    
                    // Discord API rate limit için bekleme
                    await delay(500); // Burada mesajları hızlı göndermek için 500ms bekleniyor
                } catch (memberError) {
                    logErr(`Error processing member ${member.user.tag}: ${memberError.message}`);
                    state.error++;
                    await delay(500); // Hata durumunda da bekle
                }
            } // For döngüsü sonu
            
            yellow(`Finished on ${guild.name}`);
            if (guild.memberCount <= client.config.advanced.limit && client.config.advanced.leave) {
                client.guildsToLeave.push(guild);
            }
            client.webhook.send(client.finish(guild, state.success, state.error));
            
        } catch (guildError) {
            logErr(`Error processing guild ${guild.name}: ${guildError.message}`);
            client.webhook.send(client.finish(guild, state.success, state.error));
        }
    }
}
