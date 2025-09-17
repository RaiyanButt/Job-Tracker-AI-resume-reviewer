import { Router } from "express";


const router = Router();

const clamp = (s = "", n = 8000) => (s || "").toString().slice(0, n).trim();

router.post("/review", async (req, res) => {
  try {
    const resume = clamp(req.body?.resume, 8000);
    const job = clamp(req.body?.job, 6000);
    if (!resume) return res.status(400).json({ message: "Resume text is required" });

    const system =
      "You are a concise resume coach for interns/new-grads. Return clean Markdown with bullet points. Be specific to the provided resume text and avoid generic fluff.";
    const user =
      `Task: Resume Review (optimize for ATS + impact)\n\n` +
      `Resume:\n\`\`\`\n${resume}\n\`\`\`\n\n` +
      (job ? `Job Posting:\n\`\`\`\n${job}\n\`\`\`\n\n` : "") +
      `Return exactly:\n` +
      `1) **Top 5 Fixes** — specific, resume-aware, short bullets.\n` +
      `2) **ATS Keywords** — from the job (if provided) + obvious gaps.\n` +
      `3) **3 Rewritten Bullets** — quantified, active verbs, STAR-style.\n`;

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const maxTokens = Number(process.env.AI_MAX_OUTPUT_TOKENS || 600);

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_output_tokens: maxTokens,
        temperature: 0.35,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error("OpenAI error:", resp.status, errText);
      return res.status(500).json({ message: "AI request failed", upstream: errText || resp.statusText });
    }

    const data = await resp.json();

    const text =
      data?.output?.[0]?.content?.[0]?.text || 
      data?.output_text ||                     
      data?.content?.[0]?.text ||               
      data?.choices?.[0]?.message?.content ||  
      "No content";

    return res.json({ text });
  } catch (e) {
    console.error("AI /review error:", e);
    return res.status(500).json({ message: "Internal Server Error", detail: String(e?.message || e) });
  }
});

export default router;
