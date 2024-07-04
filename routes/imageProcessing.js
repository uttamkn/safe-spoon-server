import express from "express";
import fs from "fs";
import { converBase64ToImage } from "convert-base64-to-image";
import { Client, handle_file } from "@gradio/client";

const router = express.Router();

router.post("/process_image", async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send("Image is required");
  }

  try {
    const pathToSaveImage = "./public/image.png";
    converBase64ToImage(image, pathToSaveImage);

    const client = await Client.connect(
      "https://f355a6b614a291a25d.gradio.live/"
    );
    const result = await client.predict("/predict", {
      image: handle_file(pathToSaveImage),
      allergies: "peanut",
    });

    res.json(result.data);
    fs.unlinkSync(pathToSaveImage);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Error processing image");
  }
});

export default router;
