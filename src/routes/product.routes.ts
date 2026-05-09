import { Router } from "express";
import { Brand } from "@prisma/client";
import { z } from "zod";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service";

export const productRouter = Router();

const CreateProductSchema = z.object({
  name: z.string().min(1),
  brand: z.nativeEnum(Brand),
  imageUrl: z.string().url(),
});

const UpdateProductSchema = CreateProductSchema.partial();
const BrandQuerySchema = z.nativeEnum(Brand).optional();

// GET /api/products?brand=GS25&tagLimit=3
productRouter.get("/", async (req, res, next) => {
  try {
    const brand = BrandQuerySchema.parse(req.query.brand);
    const tagLimit = req.query.tagLimit ? Number(req.query.tagLimit) : 3;
    const products = await getAllProducts(brand, tagLimit);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
productRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products
productRouter.post("/", async (req, res, next) => {
  try {
    const data = CreateProductSchema.parse(req.body);
    const product = await createProduct(data);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/products/:id
productRouter.patch("/:id", async (req, res, next) => {
  try {
    const data = UpdateProductSchema.parse(req.body);
    const product = await updateProduct(req.params.id, data);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
productRouter.delete("/:id", async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
