import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { rewriteReply } from "./lib/rewrite.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/rewrite", async (req, res) => {
  try {
    const { customerMessage, draftReply, tone } = req.body ?? {};
    const result = await rewriteReply({
      customerMessage,
      draftReply,
      tone,
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Failed to rewrite reply." });
  }
});

app.listen(PORT, () => {
  console.log(`WhatsApp Reply Helper → http://localhost:${PORT}`);
});
