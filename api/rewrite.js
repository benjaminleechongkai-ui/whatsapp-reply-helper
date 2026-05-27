import { rewriteReply } from "../lib/rewrite.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { customerMessage, draftReply, tone } = req.body ?? {};
    const result = await rewriteReply({
      customerMessage,
      draftReply,
      tone,
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    return res.status(status).json({
      error: err.message || "Failed to rewrite reply.",
    });
  }
}
