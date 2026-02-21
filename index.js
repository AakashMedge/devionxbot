require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const Groq = require("groq-sdk");

const token = process.env.BOT_TOKEN;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
app.use(express.json());

const bot = new TelegramBot(token);

app.post("/webhook", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Clawdbot AI is running 🚀");
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  if (!userMessage) return;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are Clawdbot, a smart and helpful AI assistant." },
        { role: "user", content: userMessage }
      ],
      model: "llama3-8b-8192"
    });

    const reply = completion.choices[0].message.content;

    bot.sendMessage(chatId, reply);

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "⚠️ Error contacting AI.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});