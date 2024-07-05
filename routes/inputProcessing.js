import express from "express";
import fs from "fs";
import { converBase64ToImage } from "convert-base64-to-image";
import { Client, handle_file } from "@gradio/client";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

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

    const client = await Client.connect(process.env.GRADIO_IMAGE_URI);
    const result = await client.predict("/predict", {
      image: handle_file(pathToSaveImage),
      allergies: user.allergies,
      age: user.age.toString(),
      gender: user.gender,
      weight: user.weight.toString(),
      diseases: user.anyDiseases,
    });

    res.json(result.data);
    fs.unlinkSync(pathToSaveImage);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Error processing image");
  }
});

router.post("/process_text", async (req, res) => {
  const { food, username } = req.body;

  if (!food) {
    return res.status(400).send("Food items are required");
  }

  try {
    const user = await User.findOne({ username });

    const client = await Client.connect(process.env.GRADIO_TEXT_URI);
    const result = await client.predict("/predict", {
      text: food,
      allergies: user.allergies,
      age: user.age.toString(),
      gender: user.gender,
      weight: user.weight.toString(),
      diseases: user.anyDiseases,
    });

    res.json(result.data);
  } catch (error) {
    console.error("Error processing text:", error);
    res.status(500).send("Error processing text");
  }
});

export default router;
