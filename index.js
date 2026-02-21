require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const app = express();

app.use(express.json());

const bot = new TelegramBot(token);

// Webhook endpoint
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Basic route for testing
app.get("/", (req, res) => {
    res.send("Clawdbot is running 🚀");
});

bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello Aakash 🚀 Webhook mode working!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});