import express from "express";
import "dotenv/config";

const app = express();
const cadastros = {};

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

      const t = texto.toLowerCase().trim();
      
      

        if (fromMe) {
        console.log("Mensagem enviada por mim. Ignorada.");
        return res.status(200).send("Mensagem enviada por mim. Ignorada.");
        }

        if (!cadastros[numero]) 
            { 
                if (t.includes('cadastrar') || t.includes('cadastro')) { cadastros[numero] = { etapa: 1 }; 
                await enviarResposta(numero, '📝 Vamos começar! Digite seu nome completo:'); return res.status(200).send('OK'); }
        }
        const user = cadastros[numero];
        
        if (user) {
        switch(user.etapa) {
            case 1:
                user.nome = texto;
                user.etapa = 2;
                await enviarResposta(numero, `Olá ${user.nome}! Agora digite seu E-MAIL:`);
                break;
            case 2:
                user.email = texto;
                user.etapa = 3;
                await enviarResposta(numero, 'Qual seu interesse? (cursos | suporte | vendas)');
                break;
            case 3:
                user.interesse = texto;
                console.log(`✅ LEAD CAPTURADO: ${JSON.stringify(user)}`);
                await enviarResposta(numero, `🎉 Cadastro finalizado!\n\nResumo:\n👤 Nome: ${user.nome}\n📧 E-mail: ${user.email}\n🎯 Interesse: ${user.interesse}\n\nEntraremos em contato em breve!`);
                delete cadastros[numero]; 
                break;
                default:
                await enviarResposta(numero, 'Fluxo encerrado. Digite "cadastrar" para recomeçar.');
                delete cadastros[numero];
            }
        } 
        else {
        await enviarResposta(numero, ' Olá! Digite "cadastrar" para iniciar seu registro.');
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