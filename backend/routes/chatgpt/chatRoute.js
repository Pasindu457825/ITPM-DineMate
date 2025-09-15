// routes/chatgpt/chatRoute.js
const express = require("express");
const OpenAI  = require("openai");
require("dotenv").config();

const router = express.Router();

// 1) Initialize OpenAI v4 SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 2) Chat endpoint
router.post("/", async (req, res) => {
  // 🔍 Log incoming request body
  console.log("📨 [ChatRoute] received body:", req.body);

  const userMessage = req.body.message;
  if (!userMessage) {
    console.warn("⚠️ [ChatRoute] no message provided in body");
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    // Call chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role:    "system",
          content: "You are a helpful assistant for our restaurant app.",
        },
        {
          role:    "user",
          content: userMessage,
        },
      ],
      max_tokens: 150,
    });

    const reply = completion.choices[0].message.content.trim();

    // 🔍 Log the assistant's reply
    console.log("✅ [ChatRoute] reply:", reply);

    return res.json({ reply });
  } catch (err) {
    // 🔥 Log the full error stack for diagnosis
    console.error("❌ [ChatRoute] OpenAI error stack:", err.stack || err);

    // If OpenAI returned an HTTP error payload, log that too:
    if (err.response?.data) {
      console.error("❌ [ChatRoute] OpenAI response data:", err.response.data);
    }

    return res.status(500).json({ error: "Chat service error" });
  }
});

module.exports = router;
