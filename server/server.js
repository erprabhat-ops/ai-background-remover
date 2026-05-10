import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.static("../public"));

const upload = multer({
  dest: "uploads/"
});

const HF_TOKEN = process.env.HF_TOKEN;

app.post("/remove-bg", upload.single("image"), async (req, res) => {

  try {

    const imageBuffer = fs.readFileSync(req.file.path);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/briaai/RMBG-1.4",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/octet-stream"
        },
        body: imageBuffer
      }
    );

    // IMPORTANT FIX
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("image")) {

      const errorText = await response.text();

      console.log(errorText);

      return res.status(500).json({
        error: "AI model failed",
        details: errorText
      });

    }

    const arrayBuffer = await response.arrayBuffer();

    const outputBuffer = Buffer.from(arrayBuffer);

    res.set("Content-Type", "image/png");

    res.send(outputBuffer);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Background removal failed"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});
