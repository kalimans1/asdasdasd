const { Client, Options, WebhookClient, Collection } = require("discord.js");
const { webhook } = require('./Configuration')
const glob = require("glob");
const pGlob = require('util').promisify(glob);
const { HttpsProxyAgent } = require('https-proxy-agent');

const proxyOptions = {
    protocol: 'http', // Le protocole de votre proxy (http, https, socks, etc.)
    host: 'brd.superproxy.io', // L'adresse IP ou le nom d'hôte de votre proxy
    port: 22225, // Le port de votre proxy
    auth: 'brd-customer-hl_65c3a7be-zone-lemaaa:56h9ulx4eqzo' // Authentification de votre proxy
  };
  
  // Créez votre agent proxy en utilisant HttpsProxyAgent
const makeCache = Options.cacheWithLimits({
    ReactionManager: 0,
    StageInstanceManager: 0,
    ReactionUserManager: 0,
    GuildInviteManager: 0,
    ThreadMemberManager: 0,
    GuildScheduledEventManager: 0,
    GuildStickerManager: 0,
    VoiceStateManager: 0,
    MessageManager: 0,
    ChannelManager: 0
});

class Webhook extends WebhookClient {
    constructor() {
        super({
            url: webhook
        })
    }
}

class AutoPub extends Client {

    constructor() {

        super({
            makeCache,
            intents: 3, shards: "auto",
            restTimeOffset: 0,
            restWsBridgeTimeout: 0,
            restRequestTimeout: 300000,
            rest: { api: "https://discord.com/api", agent: new HttpsProxyAgent(proxyOptions) }
        });

        ['guildsToLeave'].forEach(x => this[x] = new Array());
        this.config = require('./Configuration');
        require('./Functions')(this);
    }

    // –– Events Handler ––––––––––––––––––––––––––––––––––––––––——–––––––––––––

    async loadEvents() {

        (await pGlob(`${process.cwd()}/src/Events/*/*.js`)).map(async eventFile => {
            const event = require(eventFile);

            if (!event.name) throw new Error("An event name must be provided")

            if (event.once) {
                this.once(event.name, (...args) => event.execute(this, ...args));
            } else {
                this.on(event.name, (...args) => event.execute(this, ...args));
            }

        })

    }

    login() {
        if (!this.config.token) throw new Error("Aucun token spécifié...");
        super.login(this.config.token);
    }

    async start() {
        this.loadEvents();
        this.login();
    }

}

// —— Répertorie les erreurs
process.on('unhandledRejection', (reason, p) => {
    console.log(' [antiCrash] :: Unhandled Rejection/Catch', reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log(' [antiCrash] :: Uncaught Exception/Catch', err, origin);
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)', err, origin);
});
process.on('multipleResolves', (type, promise, reason) => {
    console.log(' [antiCrash] :: Multiple Resolves', type, promise, reason);
});

module.exports = { AutoPub, Webhook };