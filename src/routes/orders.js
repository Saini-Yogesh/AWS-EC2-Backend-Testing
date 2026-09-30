const express = require("express");
const router = express.Router();
const db = require("../data/dummy");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get("/", (req, res) => {
  let result = [...db.orders];
  if (req.query.status) result = result.filter(o => o.status === req.query.status);
  if (req.query.userId) result = result.filter(o => o.userId === parseInt(req.query.userId));
  res.json({ success: true, count: result.length, data: result });
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
router.get("/:id", (req, res) => {
  const order = db.orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ success: false, message: `Order with ID ${req.params.id} not found` });
  res.json({ success: true, data: order });
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, productId, quantity]
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               productId:
 *                 type: integer
 *                 example: 3
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Order placed
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User or Product not found
 */
router.post("/", (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;
  if (!userId || !productId) return res.status(400).json({ success: false, message: "userId and productId are required" });
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ success: false, message: `User ID ${userId} not found` });
  const product = db.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ success: false, message: `Product ID ${productId} not found` });
  const newOrder = { id: db.nextId.orders++, userId, productId, quantity, status: "pending", totalPrice: parseFloat((product.price * quantity).toFixed(2)), orderedAt: new Date().toISOString() };
  db.orders.push(newOrder);
  res.status(201).json({ success: true, message: "Order placed", data: newOrder });
});

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Fully replace an order (PUT)
 *     tags: [Orders]
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
 *             required: [userId, productId, quantity, status]
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 2
 *               productId:
 *                 type: integer
 *                 example: 4
 *               quantity:
 *                 type: integer
 *                 example: 5
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order replaced
 *       404:
 *         description: Order not found
 */
router.put("/:id", (req, res) => {
  const idx = db.orders.findIndex(o => o.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Order not found" });
  const { userId, productId, quantity, status } = req.body;
  if (!userId || !productId || !quantity || !status) return res.status(400).json({ success: false, message: "userId, productId, quantity, status required for PUT" });
  const product = db.products.find(p => p.id === productId);
  const totalPrice = product ? parseFloat((product.price * quantity).toFixed(2)) : db.orders[idx].totalPrice;
  db.orders[idx] = { id: db.orders[idx].id, userId, productId, quantity, status, totalPrice, orderedAt: db.orders[idx].orderedAt, updatedAt: new Date().toISOString() };
  res.json({ success: true, message: "Order fully updated (PUT)", data: db.orders[idx] });
});

/**
 * @swagger
 * /api/orders/{id}:
 *   patch:
 *     summary: Update order status (PATCH)
 *     tags: [Orders]
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
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 example: delivered
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Order updated
 *       404:
 *         description: Order not found
 */
router.patch("/:id", (req, res) => {
  const idx = db.orders.findIndex(o => o.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Order not found" });
  db.orders[idx] = { ...db.orders[idx], ...req.body, id: db.orders[idx].id, updatedAt: new Date().toISOString() };
  res.json({ success: true, message: "Order partially updated (PATCH)", data: db.orders[idx] });
});

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Cancel/Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: Order not found
 */
router.delete("/:id", (req, res) => {
  const idx = db.orders.findIndex(o => o.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Order not found" });
  const deleted = db.orders.splice(idx, 1)[0];
  res.json({ success: true, message: `Order #${deleted.id} deleted`, data: deleted });
});

module.exports = router;
