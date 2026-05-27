export const TONE_INSTRUCTIONS = {
  friendly:
    "Warm, approachable, and conversational — like a helpful colleague on WhatsApp. Use natural contractions where appropriate.",
  professional:
    "Clear, polite, and business-appropriate — confident but not stiff. Suitable for customer service.",
  formal:
    "Courteous and structured — complete sentences, respectful address, suitable for serious or escalated matters.",
};

export async function rewriteReply({ customerMessage, draftReply, tone, apiKey }) {
  if (!apiKey) {
    const err = new Error(
      "Server is missing ANTHROPIC_API_KEY. Add it in Vercel project settings or in .env for local dev."
    );
    err.status = 500;
    throw err;
  }

  if (!draftReply?.trim()) {
    const err = new Error("Please enter a draft reply.");
    err.status = 400;
    throw err;
  }

  if (!tone || !TONE_INSTRUCTIONS[tone]) {
    const err = new Error("Please choose a tone.");
    err.status = 400;
    throw err;
  }

  const toneGuide = TONE_INSTRUCTIONS[tone];
  const customerContext = customerMessage?.trim()
    ? `Customer's WhatsApp message (for context):\n"""${customerMessage.trim()}"""\n\n`
    : "";

  const userPrompt = `${customerContext}Staff member's draft reply (may contain broken or informal English):\n"""${draftReply.trim()}"""\n\nRewrite ONLY the staff reply in ${tone} English.\nTone guide: ${toneGuide}\n\nRules:\n- Keep the same intent and key facts; do not invent policies, prices, or promises.\n- Output plain text suitable to paste into WhatsApp (no markdown, no quotes around the message, no preamble like "Here is...").\n- Keep it concise unless the draft clearly needs more detail.\n- If the customer message is provided, make the reply fit that conversation naturally.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(
      data?.error?.message || `Claude API error (${response.status})`
    );
    err.status = response.status >= 500 ? 502 : 400;
    throw err;
  }

  const text = data.content
    ?.filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  if (!text) {
    const err = new Error("Empty response from Claude.");
    err.status = 502;
    throw err;
  }

  return { rewritten: text };
}
