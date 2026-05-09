import { Router, Request } from "express";
import { Tag } from "@prisma/client";
import { z } from "zod";
import {
  getReviewsByProduct,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../services/review.service";

export const reviewRouter = Router({ mergeParams: true });

const CreateReviewSchema = z.object({
  rating: z.number().min(0.5).max(5).multipleOf(0.5),
  comment: z.string().optional(),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.nativeEnum(Tag)).optional(),
  isPurchase: z.boolean().optional(),
});

const UpdateReviewSchema = CreateReviewSchema.partial();

// GET /api/products/:productId/reviews
reviewRouter.get("/", async (req: Request<{ productId: string }>, res, next) => {
  try {
    const reviews = await getReviewsByProduct(req.params.productId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// GET /api/reviews/:id
export const standaloneReviewRouter = Router();

standaloneReviewRouter.get("/:id", async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.id);
    res.json(review);
  } catch (err) {
    next(err);
  }
});

// POST /api/products/:productId/reviews
reviewRouter.post("/", async (req: Request<{ productId: string }>, res, next) => {
  try {
    const data = CreateReviewSchema.parse(req.body);
    const review = await createReview(req.params.productId, data);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/reviews/:id
standaloneReviewRouter.patch("/:id", async (req, res, next) => {
  try {
    const data = UpdateReviewSchema.parse(req.body);
    const review = await updateReview(req.params.id, data);
    res.json(review);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/reviews/:id
standaloneReviewRouter.delete("/:id", async (req, res, next) => {
  try {
    await deleteReview(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
