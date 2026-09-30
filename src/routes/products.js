const express = require("express");
const router = express.Router();
const db = require("../data/dummy");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog endpoints
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter by stock availability
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", (req, res) => {
  let result = [...db.products];
  if (req.query.category) result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
  if (req.query.inStock !== undefined) result = result.filter(p => p.inStock === (req.query.inStock === "true"));
  if (req.query.minPrice) result = result.filter(p => p.price >= parseFloat(req.query.minPrice));
  if (req.query.maxPrice) result = result.filter(p => p.price <= parseFloat(req.query.maxPrice));
  res.json({ success: true, count: result.length, data: result });
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: `Product with ID ${req.params.id} not found` });
  res.json({ success: true, data: product });
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, category]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gaming Chair
 *               price:
 *                 type: number
 *                 example: 349.99
 *               category:
 *                 type: string
 *                 example: Furniture
 *               stock:
 *                 type: integer
 *                 example: 15
 *               rating:
 *                 type: number
 *                 example: 4.2
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/", (req, res) => {
  const { name, price, category, stock = 0, rating = 0 } = req.body;
  if (!name || !price || !category) return res.status(400).json({ success: false, message: "name, price, and category are required" });
  const newProduct = { id: db.nextId.products++, name, price: parseFloat(price), category, stock, rating, inStock: stock > 0 };
  db.products.push(newProduct);
  res.status(201).json({ success: true, message: "Product created", data: newProduct });
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Fully replace a product (PUT)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, category, stock, rating]
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Product Name
 *               price:
 *                 type: number
 *                 example: 499.99
 *               category:
 *                 type: string
 *                 example: Electronics
 *               stock:
 *                 type: integer
 *                 example: 100
 *               rating:
 *                 type: number
 *                 example: 4.9
 *     responses:
 *       200:
 *         description: Product replaced
 *       404:
 *         description: Product not found
 */
router.put("/:id", (req, res) => {
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Product not found" });
  const { name, price, category, stock, rating } = req.body;
  if (!name || !price || !category) return res.status(400).json({ success: false, message: "name, price, and category required for PUT" });
  db.products[idx] = { id: db.products[idx].id, name, price: parseFloat(price), category, stock: stock ?? 0, rating: rating ?? 0, inStock: (stock ?? 0) > 0 };
  res.json({ success: true, message: "Product fully updated (PUT)", data: db.products[idx] });
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Partially update a product (PATCH)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 example: 79.99
 *               stock:
 *                 type: integer
 *                 example: 200
 *               rating:
 *                 type: number
 *                 example: 4.0
 *     responses:
 *       200:
 *         description: Product partially updated
 *       404:
 *         description: Product not found
 */
router.patch("/:id", (req, res) => {
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Product not found" });
  db.products[idx] = { ...db.products[idx], ...req.body, id: db.products[idx].id };
  if (req.body.stock !== undefined) db.products[idx].inStock = db.products[idx].stock > 0;
  res.json({ success: true, message: "Product partially updated (PATCH)", data: db.products[idx] });
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete("/:id", (req, res) => {
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Product not found" });
  const deleted = db.products.splice(idx, 1)[0];
  res.json({ success: true, message: `Product "${deleted.name}" deleted`, data: deleted });
});

module.exports = router;
