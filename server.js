import express from "express";
import multer from "multer";
import fs from "fs";
import "dotenv/config";
import { runOCR } from "./ocr.js";
import cors from 'cors';

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(express.json());
app.use(cors());
app.post("/v1/ocr", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const pages = await runOCR(req.file.path);

    fs.unlinkSync(req.file.path);

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

app.listen(process.env.PORT, () => {
  console.log(`OCR Server running on port ${process.env.PORT}`);
});
