const { AutoPub, Webhook } = require("./src/Structures/AutoPub");
const client = new AutoPub();
client.webhook = new Webhook();

client.start();

// --- Render deploy fix: Fake web server ---
const http = require("http");
const port = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
}).listen(port, () => {
  console.log(`Fake web service running on port ${port}`);
});
