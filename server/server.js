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

    if (!response.ok) {
      throw new Error("AI processing failed");
    }

    const outputBuffer = Buffer.from(await response.arrayBuffer());

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
