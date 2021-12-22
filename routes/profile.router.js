let express = require('express');
let router = express.Router();

let authController = require('../controller/profile.controller');

router.post('/', authController.createProfile);
router.put('/', authController.editProfile);
router.post('/', authController.deleteProfile);
router.get('/', authController.listProfile);

module.exports = router;