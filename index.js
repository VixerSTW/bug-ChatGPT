const fs = require("fs");
const path = require("path");

// Load semua plugin
const plugins = new Map();
fs.readdirSync(path.join(__dirname, "plugins")).forEach((file) => {
  if (file.endsWith(".js")) {
    const plugin = require(`./plugins/${file}`);
    plugins.set(plugin.name, plugin);
  }
});

// Event handler ketika menerima pesan
conn.ev.on("messages.upsert", async ({ messages }) => {
  let msg = messages[0];
  if (!msg.message || !msg.key.remoteJid) return;
  let text = msg.message.conversation || msg.message.extendedTextMessage?.text;
  
  if (text && plugins.has(text)) {
    let command = plugins.get(text);
    await command.execute(conn, msg.key.remoteJid);
  }
});