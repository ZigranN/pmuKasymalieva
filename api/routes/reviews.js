import express from "express";
import { createReview, getReviews } from "../controllers/reviewsController.js";

const router = express.Router();

router.post("/", createReview);   // POST /api/reviews
router.get("/", getReviews);      // GET  /api/reviews

export default router;
