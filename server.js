import express from "express";
import "dotenv/config";

const app = express();

app.use(express.json());

const EVO_URL = process.env.EVO_URL;
const EVO_KEY = process.env.INSTANCE_API_KEY;
const INSTANCE = process.env.INSTANCE_NAME;
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot da Sprint 6 está rodando!");
});

app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook recebido:");
    console.log(JSON.stringify(req.body, null, 2));

    const body = req.body;
    const evento = body.event;

    if (evento === "messages.upsert" || evento === "MESSAGES_UPSERT") {
      const msg = Array.isArray(body.data) ? body.data[0] : body.data;

      const numero = msg?.key?.remoteJid;
      const fromMe = msg?.key?.fromMe;

      const texto =
        msg?.message?.conversation ||
        msg?.message?.extendedTextMessage?.text ||
        "";

      console.log("Número:", numero);
      console.log("Texto:", texto);

      if (fromMe) {
        console.log("Mensagem enviada por mim. Ignorada.");
        return res.status(200).send("Mensagem enviada por mim. Ignorada.");
        }

      if (texto.toLowerCase().trim() === "oi") {
        await enviarResposta(numero, "Olá! Sou o bot da Reobote 🤖");
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.status(200).send("Erro tratado");
  }
});

async function enviarResposta(numero, texto) {
  const numeroLimpo = numero.replace("@s.whatsapp.net", "");

  const resposta = await fetch(`${EVO_URL}/message/sendText/${INSTANCE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: EVO_KEY
    },
    body: JSON.stringify({
      number: numeroLimpo,
      text: texto
    })
  });

  const dados = await resposta.text();

  console.log("Status da resposta:", resposta.status);
  console.log("Resposta da Evolution:", dados);
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});