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
// });

// module.exports= router;
const router = require('express').Router();
const { authenticate, superAdminAuth } = require('../middleware/authentication');
const { 
    register, verifyUsers, login, getAll, resendVerificationEmail, makeAdmin 
} = require('../controllers/userController');
const { registerValidate } = require('../middleware/validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     description: Create a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPass@123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', registerValidate, register);

/**
 * @swagger
 * /api/v1/verify-user/{token}:
 *   get:
 *     summary: Verify user via email token
 *     tags: [Users]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "someVerificationToken"
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/verify-user/:token', verifyUsers);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Authenticate user and return token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPass@123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *       401:
 *         description: Unauthorized (requires authentication)
 */
router.get('/users', authenticate, getAll);

/**
 * @swagger
 * /api/v1/verify:
 *   get:
 *     summary: Resend verification email
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *       400:
 *         description: User is already verified
 */
router.get('/verify', resendVerificationEmail);

/**
 * @swagger
 * /api/v1/make-admin/{id}:
 *   patch:
 *     summary: Assign admin role to a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "65abcd123456ef7890ghijk"
 *     responses:
 *       200:
 *         description: User promoted to admin
 *       403:
 *         description: Only super admins can perform this action
 */
router.patch('/make-admin/:id', authenticate, superAdminAuth, makeAdmin);

/**
 * @swagger
 * /api/v1/google-authenticate:
 *   get:
 *     summary: Google OAuth authentication
 *     tags: [Users]
 *     description: Redirects user to Google's OAuth login page.
 *     responses:
 *       302:
 *         description: Redirects to Google login
 */
router.get('/google-authenticate', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/v1/auth/google/login:
 *   get:
 *     summary: Google OAuth login callback
 *     tags: [Users]
 *     description: Handles authentication after Google login and returns JWT token.
 *     responses:
 *       200:
 *         description: Google authentication successful
 */
router.get('/auth/google/login', passport.authenticate('google'), async (req, res) => {
    const token = await jwt.sign(
        { userId: req.user._id, isVerified: req.user.isVerified },
        process.env.key,
        { expiresIn: "1d" }
    );
    res.status(200).json({
        message: 'Google Auth Logic Successfully',
        data: req.user,
        token
    });
});

module.exports = router;
