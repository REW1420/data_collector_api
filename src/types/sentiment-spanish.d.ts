// src/types/sentiment-spanish.d.ts
declare module "sentiment-spanish" {
  interface SentimentResult {
    score: number;
    comparative: number;
    words: string[];
    positive: string[];
    negative: string[];
  }

  function sentiment(text: string): SentimentResult;

  export default sentiment;
}
