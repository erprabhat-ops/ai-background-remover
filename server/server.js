import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { removeBackground } from "rembg-node";

const app = express();

app.use(cors());
app.use(express.static("../public"));

const upload = multer({
  dest: "uploads/"
});

app.post("/remove-bg", upload.single("image"), async (req, res) => {

  try {

    const inputPath = req.file.path;

    const inputBuffer = fs.readFileSync(inputPath);

    // AI Background Removal
    const outputBuffer = await removeBackground(inputBuffer);

    fs.unlinkSync(inputPath);

    // IMPORTANT
    res.set("Content-Type", "image/png");

    res.send(outputBuffer);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: "Background removal failed"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});
