// utils/sentiment_hf.ts
import axios from "axios";

const HF_API_URL =
  "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment";

export async function analizarSentimientoHF(
  texto: string
): Promise<"positivo" | "negativo" | "neutral"> {
  const response = await axios.post(
    HF_API_URL,
    { inputs: texto },
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
      },
    }
  );

  const predictions = response.data[0]; // array de {label: '1 star', score: ...}

  const top = predictions.reduce((a: any, b: any) =>
    a.score > b.score ? a : b
  );
  const estrellas = parseInt(top.label[0]);

  if (estrellas <= 2) return "negativo";
  if (estrellas === 3) return "neutral";
  return "positivo";
}
