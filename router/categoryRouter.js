// const categoryRouter = require('express').Router();

// const { createCategory, getAll } = require('../controllers/categoryController');
// const { authenticate, adminAuth } = require('../middleware/authentication');

// categoryRouter.post('/category',authenticate, adminAuth, createCategory);
// categoryRouter.get('category', getAll)

// module.exports = categoryRouter;

const categoryRouter = require("express").Router();
const { createCategory, getAll } = require("../controllers/categoryController");
const { authenticate, adminAuth } = require("../middleware/authentication");

/**
 * @swagger
 * /api/v1/category:
 *   post:
 *     summary: Create a new category
 *     security:
 *       - bearerAuth: []
 *     description: Only admins can create a category.
 *     responses:
 *       201:
 *         description: Category created successfully
 *       403:
 *         description: Unauthorized
 */
categoryRouter.post("/category", authenticate, adminAuth, createCategory);

/**
 * @swagger
 * /api/v1/category:
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: A list of categories
 */
categoryRouter.get("/category", getAll);

module.exports = categoryRouter;
