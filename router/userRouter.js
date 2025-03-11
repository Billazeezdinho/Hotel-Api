const router = require('express').Router()
const { authenticate, superAdminAuth } = require('../middleware/authentication')
const { register, verifyUsers, login, getAll, resendVerificationEmail, makeAdmin } = require('../controllers/userController');
const { registerValidate } = require('../middleware/validator');

router.post('/register', registerValidate ,register);
router.get('/verify-user/:token', verifyUsers);
router.post('/login', login);
router.get('/users', authenticate, getAll);
router.get('/verify', resendVerificationEmail);
router.patch('/make-admin/:id', authenticate, superAdminAuth, makeAdmin)

module.exports= router;