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
 * /register:
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
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
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
 * /verify-user/{token}:
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
 * /login:
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
 *                 example: "johndoe@gmail.com"
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
 * /users:
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
 * /verify:
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
 * /make-admin/{id}:
 *   patch:
 *     summary: Assign admin role to a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: [] # Requires authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to be promoted
 *         example: "65abcd123456ef7890ghijk"
 *     responses:
 *       200:
 *         description: User promoted to admin successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User John Doe is now an admin"
 *       400:
 *         description: Bad Request - User is Already an Admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is already an admin"
 *       401:
 *         description: Unauthorized - Token Required or Expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied, token must be provided"
 *       403:
 *         description: Only super admins can perform this action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: Not a super admin"
 *       404:
 *         description: Not Found - User Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.patch('/make-admin/:id', authenticate, superAdminAuth, makeAdmin);


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication including Google OAuth and manual signup/login
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Create an account for the hotel booking system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
 *               password:
 *                 type: string
 *                 example: "SecurePass@123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user and return token
 *     tags: [Authentication]
 *     description: Logs in a user and returns an authentication token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
 *               password:
 *                 type: string
 *                 example: "SecurePass@123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1..."
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /google-authenticate:
 *   get:
 *     summary: Redirect user to Google authentication
 *     tags: [Authentication]
 *     description: Initiates Google OAuth authentication flow.
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 */
router.get('/google-authenticate', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/login:
 *   get:
 *     summary: Authenticate user via Google OAuth
 *     tags: [Authentication]
 *     description: Logs in the user via Google OAuth and returns a JWT token.
 *     responses:
 *       200:
 *         description: Google Authentication Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Google Auth Logic Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65abcd123456ef7890ghijk"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@gmail.com"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1..."
 *       401:
 *         description: Unauthorized - Google authentication failed
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
