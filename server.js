import express from "express";
import "dotenv/config";

const app = express();

app.use(express.json());

const EVO_URL = process.env.EVO_URL;
const INSTANCE_API_KEY = process.env.INSTANCE_API_KEY;
const INSTANCE_NAME = process.env.INSTANCE_NAME;
const PORT = process.env.PORT || 3000;


app.get("/", (req,res) =>{
    res.send("Teste bot rodando")
});

app.post("webhook", async (req,res) =>{
    try {
        console.log("Webhook recebido: ");
        console.log(JSON.stringify(req.body, null, 2));

        const body = req.body;
        const evento = body.event;

        if (evento === "messages.upsert" || evento === "MESSAGES_UPSERT") {
            const msg = data.data[0];
            const numero = msg.key.remoteJid;
            const texto = msg.message?.conversation || '';   

        if (fromMe) {
        return res.status(200).send("Mensagem enviada por mim. Ignorada.");
    }


        if (texto.toLowerCase().trim() === 'oi') {
            await enviarResposta(numero, 'Olá, Sou o bot da Reobote!');
        }
        }  
        res.status(200).send("OK!");
    } catch (error) {
        console.log("Erro no Webhook: ", error);
    }
});

async function enviarResposta(numero, texto) {
    const numeroLimpo = numero.replaca("@s.whatsapp.net,", "");

     const resposta = await fetch(`${EVO_URL}/message/sendText/${INSTANCE}`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            apikey: EVO_KEY
        },
    })
        body:json.stringify({
            number: numeroLimpo,
            text: texto
        })
};

app.listen(process.env.PORT || 3000);
console.log(`Servidor rodando na porta ${PORT}`);