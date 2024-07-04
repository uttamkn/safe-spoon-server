import express from "express";
import { Client } from "@gradio/client";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.json());

router.post("/process_image", async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send("Image is required");
  }

  try {
    const imageBuffer = Buffer.from(image, "base64");
    const client = await Client.connect("suhas1324/SafeSpoon");
    const result = await client.predict("/predict", {
      image: imageBuffer,
    });

    res.json(result.data);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Error processing image");
  }
});

export default router;
