import express from "express";
import FB from "fb";

const app = express();

function fbApi(path: string, method = "GET", params = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    FB.api(path, method, params, (response: any) => {
      if (!response || response.error)
        reject(response ? response.error : "Unknown error");
      else resolve(response);
    });
  });
}

app.get("/", async (req, res) => {
  const pageId = "111979705309346";
  const accessToken =
    "EAAD9JrwCuZA0BOzNwy8ofZBqN6mYRR0Yu5Oom0fZBFm29mKAgJes5fXFwuiQt57giQeRvH862nGeFEvBj3C8ZChdLZAlleceXJpIYgtpKnKaaaNFKPOAixUD22mzd37cPSPUGarUBMN2JTql5n3TNslgUb4pzzumnxvN7rTiGk0HimhAlrtGraZAHzW7Xvkt2EiGWVHpLHXuLTdH9a9xVhVLDZCGdC4iV0ZD";

  FB.setAccessToken(accessToken);

  try {
    const fbResponse = await fbApi(`/${pageId}/posts`, "GET", {
      fields: "id,message,created_time",
    });
    res.json(fbResponse.data);
  } catch (error) {
    console.error("Error al obtener posts:", error);
    res.status(500).json({ error: "Error al obtener posts" });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
