import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { removeBackground } from "@imgly/background-removal-node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.static("../public"));

const upload = multer({
  dest: "uploads/"
});

app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    const inputPath = req.file.path;

    const imageBuffer = fs.readFileSync(inputPath);

    // Remove background
    const blob = await removeBackground(imageBuffer);

    const arrayBuffer = await blob.arrayBuffer();

    const outputBuffer = Buffer.from(arrayBuffer);

    fs.unlinkSync(inputPath);

    res.setHeader("Content-Type", "image/png");
    res.send(outputBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Background removal failed"
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});