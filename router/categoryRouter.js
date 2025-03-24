// const categoryRouter = require('express').Router();

// const { createCategory, getAll } = require('../controllers/categoryController');
// const { authenticate, adminAuth } = require('../middleware/authentication');

// categoryRouter.post('/category',authenticate, adminAuth, createCategory);
// categoryRouter.get('category', getAll)

// module.exports = categoryRouter;

const categoryRouter = require('express').Router();
const { createCategory, getAll } = require('../controllers/categoryController');
const { authenticate, adminAuth } = require('../middleware/authentication');

/**
 * @swagger
 * /api/v1/category:
 *   post:
 *     summary: Create a new category
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Categories
 *     description: Only admins can create a category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Luxury"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized (Admin Access Required)
 */
categoryRouter.post('/category', authenticate, adminAuth, createCategory);

/**
 * @swagger
 * /api/v1/category:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Successfully retrieved all categories
 */
categoryRouter.get('/category', getAll);

module.exports = categoryRouter;
