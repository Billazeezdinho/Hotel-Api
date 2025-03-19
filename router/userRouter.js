const router = require('express').Router();
const { authenticate, superAdminAuth } = require('../middleware/authentication');
const { register, verifyUsers, login, getAll, resendVerificationEmail, makeAdmin } = require('../controllers/userController');
const { registerValidate } = require('../middleware/validator');
const passport = require('passport');
const jwt = require('jsonwebtoken')


router.post('/register', registerValidate ,register)
router.get('/verify-user/:token', verifyUsers)
router.post('/login', login)
router.get('/users', authenticate, getAll)
router.get('/verify', resendVerificationEmail)
router.patch('/make-admin/:id', authenticate, superAdminAuth, makeAdmin)

router.get('google-authenticate', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('auth/google/login', passport.authenticate('google'), async(req, res) =>{
    const token = await jwt.sign({ userId: req.user._id, isVerified: req.user.isVerified }, process.env.key, { expiresIn: "1d" });
    res.status(200).json({
        message: 'Google Auth Logic Successfully',
        data: req.user,
        token
    });
      
})
module.exports= router;