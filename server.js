
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("."));

app.post("/api/submit", async (req, res) => {
  const webhook = process.env.DISCORD_WEBHOOK;

  if (!webhook) {
    return res.status(500).json({ error: "Webhook not configured" });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "Новая анкета VC+AlexBit",
        embeds: [{
          title: "Анкета участника",
          description: "```json\n" +
            JSON.stringify(req.body, null, 2).slice(0, 3500) +
            "\n```"
        }]
      })
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Discord send failed" });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Send failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on ${port}`));
