const categoryRouter = require('express').Router();

const { createCategory, getAll } = require('../controllers/categoryController');
const { authenticate, adminAuth } = require('../middleware/authentication');

categoryRouter.post('/category',authenticate, adminAuth, createCategory);
categoryRouter.get('category', getAll)

module.exports = categoryRouter;