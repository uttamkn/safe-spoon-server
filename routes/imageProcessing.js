import express from "express";
import fs from "fs";
import { converBase64ToImage } from "convert-base64-to-image";
import { Client, handle_file } from "@gradio/client";
import User from "../models/User.js";

const router = express.Router();

router.post("/process_image", async (req, res) => {
  const { image, username } = req.body;

  if (!image) {
    return res.status(400).send("Image is required");
  }

  try {
    const user = await User.findOne({ username });
    const pathToSaveImage = "./public/image.png";
    converBase64ToImage(image, pathToSaveImage);

    const client = await Client.connect(
      "https://a6b1e34d64bf48bd3c.gradio.live"
    );
    const result = await client.predict("/predict", {
      image: handle_file(pathToSaveImage),
      allergies: user.allergies,
      age: user.age.toString(),
      gender: user.gender,
      weight: user.weight.toString(),
      diseases: user.diseases,
    });

    res.json(result.data);
    fs.unlinkSync(pathToSaveImage);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Error processing image");
  }
});

export default router;
