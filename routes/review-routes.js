import express from "express";
import { createReview, getAllReviews } from "../controllers/review-controllers.js";

const reviewRouter = express.Router();

reviewRouter.post('/', createReview)
reviewRouter.get('/', getAllReviews)

export default reviewRouter;