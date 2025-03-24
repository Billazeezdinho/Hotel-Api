// const router = require('express').Router();
// const { authenticate, superAdminAuth } = require('../middleware/authentication');
// const { register, verifyUsers, login, getAll, resendVerificationEmail, makeAdmin } = require('../controllers/userController');
// const { registerValidate } = require('../middleware/validator');
// const passport = require('passport');
// const jwt = require('jsonwebtoken')


// router.post('/register', registerValidate ,register)
// router.get('/verify-user/:token', verifyUsers)
// router.post('/login', login)
// router.get('/users', authenticate, getAll)
// router.get('/verify', resendVerificationEmail)
// router.patch('/make-admin/:id', authenticate, superAdminAuth, makeAdmin)

// router.get('/google-authenticate', passport.authenticate('google', {scope: ['profile', 'email']}));
// router.get('/auth/google/login', passport.authenticate('google'), async(req, res) =>{
//     const token = await jwt.sign({ userId: req.user._id, isVerified: req.user.isVerified }, process.env.key, { expiresIn: "1d" });
//     res.status(200).json({
//         message: 'Google Auth Logic Successfully',
//         data: req.user,
//         token
//     });
// })



// module.exports= router;

const router = require("express").Router();
const { authenticate, superAdminAuth } = require("../middleware/authentication");
const { register, verifyUsers, login, getAll, resendVerificationEmail, makeAdmin } = require("../controllers/userController");
const { registerValidate } = require("../middleware/validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", registerValidate, register);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Log in a user
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/login", login);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get("/users", authenticate, getAll);

/**
 * @swagger
 * /api/v1/make-admin/{id}:
 *   patch:
 *     summary: Promote a user to admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User promoted to admin
 */
router.patch("/make-admin/:id", authenticate, superAdminAuth, makeAdmin);

module.exports = router;
