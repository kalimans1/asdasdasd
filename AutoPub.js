const { AutoPub, Webhook } = require("./src/Structures/AutoPub");
const client = new AutoPub();
client.webhook = new Webhook();
client.start();