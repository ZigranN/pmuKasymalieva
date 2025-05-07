import express from "express";
import { addImage, getGallery } from "../controllers/galleryController.js";
import { upload } from "../middlewares/upload.js";
import {adminOnly, protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), addImage);
router.get("/", getGallery);                       // GET  /api/gallery

export default router;
