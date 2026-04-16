import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/shape", async (req, res) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
  {
    role: "system",
    content: "You are a shape generator. Only return JSON array of 2D points like [[x,y],[x,y]]. No explanation."
  },
  ...req.body.messages
]
      })
    });

    const data = await response.json();

    // simple response
    const text = data.choices?.[0]?.message?.content || "[]";

    // extract JSON array
    const match = text.match(/\[[\s\S]*\]/);
    const points = match ? JSON.parse(match[0]) : [];

    res.json({ points });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running...");
});
