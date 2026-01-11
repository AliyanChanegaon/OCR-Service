import express from "express";
import multer from "multer";
import cors from "cors";
import { runOCRBuffer } from "./ocr.js"; // updated function

const app = express();
const storage = multer.memoryStorage();   // memory storage
const upload = multer({ storage });

app.use(cors());

app.post("/v1/ocr", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const pages = await runOCRBuffer(req.file.buffer);

    res.json({
      success: true,
      totalPages: pages.length,
      pages
    });

  } catch (err) {
    console.error("OCR ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`OCR Server running on port ${process.env.PORT || 3000}`);
});
