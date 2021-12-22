let express = require('express');
let router = express.Router();

let authController = require('../controller/auth.controller');

router.post('/signup', authController.createUser);
router.put('/verify', authController.updateUser);
router.post('/login', authController.login);
router.get('/data', authController.listUser);
router.post('/forgot', authController.forgotPassword);
router.post("/reset",authController.resetPassword);
router.get("/userVerify/:id",authController.userVerify);
router.get("/passwordVerify/:token",authController.passwordVerify);
module.exports = router;