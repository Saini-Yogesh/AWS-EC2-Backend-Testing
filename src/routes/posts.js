const express = require("express");
const router = express.Router();
const db = require("../data/dummy");

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Blog post endpoints
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter posts by author user ID
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag (e.g. aws, docker)
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get("/", (req, res) => {
  let result = [...db.posts];
  if (req.query.userId) result = result.filter(p => p.userId === parseInt(req.query.userId));
  if (req.query.tag) result = result.filter(p => p.tags.includes(req.query.tag.toLowerCase()));
  res.json({ success: true, count: result.length, data: result });
});

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 */
router.get("/:id", (req, res) => {
  const post = db.posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ success: false, message: `Post with ID ${req.params.id} not found` });
  res.json({ success: true, data: post });
});

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, title, body]
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: My New Blog Post
 *               body:
 *                 type: string
 *                 example: This is the content of the blog post.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["aws", "tutorial"]
 *     responses:
 *       201:
 *         description: Post created
 *       400:
 *         description: Missing required fields
 */
router.post("/", (req, res) => {
  const { userId, title, body, tags = [] } = req.body;
  if (!userId || !title || !body) return res.status(400).json({ success: false, message: "userId, title, and body are required" });
  const newPost = { id: db.nextId.posts++, userId, title, body, tags, likes: 0, createdAt: new Date().toISOString() };
  db.posts.push(newPost);
  res.status(201).json({ success: true, message: "Post created", data: newPost });
});

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Fully replace a post (PUT)
 *     tags: [Posts]
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
 *             required: [userId, title, body]
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 2
 *               title:
 *                 type: string
 *                 example: Updated Post Title
 *               body:
 *                 type: string
 *                 example: Updated post body content here.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["nodejs", "backend"]
 *     responses:
 *       200:
 *         description: Post replaced
 *       404:
 *         description: Post not found
 */
router.put("/:id", (req, res) => {
  const idx = db.posts.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Post not found" });
  const { userId, title, body, tags = [] } = req.body;
  if (!userId || !title || !body) return res.status(400).json({ success: false, message: "userId, title, and body required for PUT" });
  db.posts[idx] = { id: db.posts[idx].id, userId, title, body, tags, likes: db.posts[idx].likes, createdAt: db.posts[idx].createdAt, updatedAt: new Date().toISOString() };
  res.json({ success: true, message: "Post fully updated (PUT)", data: db.posts[idx] });
});

/**
 * @swagger
 * /api/posts/{id}:
 *   patch:
 *     summary: Partially update a post (PATCH)
 *     tags: [Posts]
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
 *               title:
 *                 type: string
 *                 example: Patched Title Only
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["patched", "updated"]
 *               likes:
 *                 type: integer
 *                 example: 99
 *     responses:
 *       200:
 *         description: Post partially updated
 *       404:
 *         description: Post not found
 */
router.patch("/:id", (req, res) => {
  const idx = db.posts.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Post not found" });
  db.posts[idx] = { ...db.posts[idx], ...req.body, id: db.posts[idx].id, updatedAt: new Date().toISOString() };
  res.json({ success: true, message: "Post partially updated (PATCH)", data: db.posts[idx] });
});

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 */
router.delete("/:id", (req, res) => {
  const idx = db.posts.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Post not found" });
  const deleted = db.posts.splice(idx, 1)[0];
  res.json({ success: true, message: `Post "${deleted.title}" deleted`, data: deleted });
});

module.exports = router;
