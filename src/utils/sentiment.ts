import sentiment from "sentiment-spanish";

export function analizarSentimiento(
  texto: string
): "positivo" | "negativo" | "neutral" {
  const result = sentiment(texto);
  console.log(texto, result.score);
  if (result.score > 0) return "positivo";
  if (result.score < 0) return "negativo";
  return "neutral";
}
