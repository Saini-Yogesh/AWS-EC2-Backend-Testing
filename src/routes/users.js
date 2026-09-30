const express = require("express");
const router = express.Router();
const db = require("../data/dummy");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, user, mod]
 *         description: Filter users by role
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get("/", (req, res) => {
  let result = [...db.users];
  if (req.query.role)   result = result.filter(u => u.role === req.query.role);
  if (req.query.active !== undefined) result = result.filter(u => u.active === (req.query.active === "true"));
  res.json({ success: true, count: result.length, data: result });
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/:id", (req, res) => {
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: `User with ID ${req.params.id} not found` });
  res.json({ success: true, data: user });
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               role:
 *                 type: string
 *                 enum: [admin, user, mod]
 *                 example: user
 *               age:
 *                 type: integer
 *                 example: 25
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", (req, res) => {
  const { name, email, role = "user", age = 18, active = true } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, message: "Name and email are required" });
  const existing = db.users.find(u => u.email === email);
  if (existing) return res.status(409).json({ success: false, message: "Email already exists" });
  const newUser = { id: db.nextId.users++, name, email, role, age, active, createdAt: new Date().toISOString() };
  db.users.push(newUser);
  res.status(201).json({ success: true, message: "User created", data: newUser });
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Fully replace a user (PUT)
 *     tags: [Users]
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
 *             required: [name, email, role, age, active]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *               role:
 *                 type: string
 *                 enum: [admin, user, mod]
 *                 example: admin
 *               age:
 *                 type: integer
 *                 example: 30
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User replaced
 *       404:
 *         description: User not found
 */
router.put("/:id", (req, res) => {
  const idx = db.users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "User not found" });
  const { name, email, role, age, active } = req.body;
  if (!name || !email || !role) return res.status(400).json({ success: false, message: "name, email, and role are required for PUT" });
  db.users[idx] = { id: db.users[idx].id, name, email, role, age: age ?? db.users[idx].age, active: active ?? db.users[idx].active, createdAt: db.users[idx].createdAt, updatedAt: new Date().toISOString() };
  res.json({ success: true, message: "User fully updated (PUT)", data: db.users[idx] });
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Partially update a user (PATCH)
 *     tags: [Users]
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
 *               name:
 *                 type: string
 *                 example: Partially Updated Name
 *               role:
 *                 type: string
 *                 enum: [admin, user, mod]
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User partially updated
 *       404:
 *         description: User not found
 */
router.patch("/:id", (req, res) => {
  const idx = db.users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "User not found" });
  db.users[idx] = { ...db.users[idx], ...req.body, id: db.users[idx].id, updatedAt: new Date().toISOString() };
  res.json({ success: true, message: "User partially updated (PATCH)", data: db.users[idx] });
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/:id", (req, res) => {
  const idx = db.users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "User not found" });
  const deleted = db.users.splice(idx, 1)[0];
  res.json({ success: true, message: `User "${deleted.name}" deleted`, data: deleted });
});

module.exports = router;
