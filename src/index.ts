import express from "express";
import FB from "fb";
import { analizarSentimiento } from "./utils/sentiment";
import { analizarSentimientoHF } from "./utils/sentiment_hf";
require("dotenv").config();

const app = express();
//helper
function fbApi(path: string, method = "GET", params = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    FB.api(path, method, params, (response: any) => {
      if (!response || response.error)
        reject(response ? response.error : "Unknown error");
      else resolve(response);
    });
  });
}
const PAGE_ID = "111979705309346";
const accessToken = process.env.TOKEN_TEST;
FB.setAccessToken(accessToken);

//hello world

app.get("/", (req, res) => {
  res.json("Hello world");
});
//post endpoint
app.get("/post", async (req, res) => {
  try {
    const fbResponse = await fbApi(`/${PAGE_ID}/posts`, "GET", {
      fields: "id,message,created_time",
    });
    res.json(fbResponse.data);
  } catch (error) {
    console.error("Error al obtener posts:", error);
    res.status(500).json({ error: "Error al obtener posts" });
  }
});

//comments endpoint

app.get("/comments", async (req, res) => {
  try {
    const response = await fbApi(`/${PAGE_ID}/posts`, "GET", { fields: "id" });
    const posts = response.data;

    const comments = await Promise.all(
      posts.map(async (post: any) => {
        const resComments = await fbApi(`/${post.id}/comments`, "GET", {
          fields: "id,message,created_time",
        });

        // Procesar comentarios con los 3 métodos:
        const comentariosConSentimientos = await Promise.all(
          resComments.data.map(async (comment: any) => {
            const texto = comment.message || "";

            // Local (síncrono)
            const localSentiment = analizarSentimiento(texto);

            // HF y OpenAI (async)
            {
              /**
             *  const [hfSentiment] = await Promise.all([
              analizarSentimientoHF(texto),
            ]);
             */
            }

            return {
              ...comment,
              sentiment_local: localSentiment,
              // sentiment_hf: hfSentiment,
            };
          })
        );

        return {
          post_id: post.id,
          comments: comentariosConSentimientos,
        };
      })
    );

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

//reactions

app.get("/reactions", async (req, res) => {
  try {
    const response = await fbApi(`/${PAGE_ID}/posts`, "GET", { fields: "id" });
    const posts = response.data;

    const reactions = await Promise.all(
      posts.map((post: any) =>
        fbApi(`/${post.id}/reactions`, "GET", {
          fields: "id,type,name",
        }).then((res) => ({ post_id: post.id, reactions: res.data }))
      )
    );

    res.json(reactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener reacciones" });
  }
});

//insights
app.get("/insights", async (req, res) => {
  try {
    const insights = await fbApi(`/${PAGE_ID}/insights`, "GET", {
      metric: "page_impressions,page_engaged_users,page_views_total",
      period: "day",
    });

    res.json(insights.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener insights" });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
