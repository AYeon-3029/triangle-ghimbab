import express, { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { productRouter } from "./routes/product.routes";
import { reviewRouter, standaloneReviewRouter } from "./routes/review.routes";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

// Routes
app.use("/api/products", productRouter);
app.use("/api/products/:productId/reviews", reviewRouter);
app.use("/api/reviews", standaloneReviewRouter);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Global error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Validation error", details: err.flatten() });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(400).json({ error: "Database error", code: err.code });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
