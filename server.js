require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.STABILITY_API_KEY;

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "ZIZTEC backend", stabilityKeyConfigured: Boolean(API_KEY) });
});

app.post("/api/music/generate", upload.none(), async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "STABILITY_API_KEY não está configurada no servidor." });

    const title = String(req.body.title || "").trim();
    const style = String(req.body.style || "").trim();
    const lyrics = String(req.body.lyrics || "").trim();

    if (!title || !style || !lyrics) {
      return res.status(400).json({ error: "Título, estilo musical e letra são obrigatórios." });
    }

    const prompt = [
      `Title: ${title}`,
      `Genre/style: ${style}`,
      "Create a complete musical composition inspired by the following lyrics and style.",
      "Aim for a coherent song arrangement, rhythm, melody, instrumentation and vocals when supported by the model.",
      `Lyrics: ${lyrics}`
    ].join("\n");

    const form = new FormData();
    form.append("prompt", prompt);
    form.append("model", "stable-audio-2.5");
    form.append("output_format", "mp3");
    form.append("duration", "120");

    const response = await fetch(
      "https://api.stability.ai/v2beta/audio/stable-audio-2/text-to-audio",
      { method: "POST", headers: { "authorization": `Bearer ${API_KEY}`, "accept": "audio/*" }, body: form }
    );

    const contentType = response.headers.get("content-type") || "";
    if (!response.ok) {
      const details = contentType.includes("application/json") ? JSON.stringify(await response.json()) : await response.text();
      return res.status(response.status).json({ error: "A Stability AI recusou a geração.", details });
    }

    const audio = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `inline; filename="ziztec-${Date.now()}.mp3"`);
    res.send(audio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no backend ZIZTEC." });
  }
});

app.listen(PORT, () => console.log(`ZIZTEC backend iniciado na porta ${PORT}`));
