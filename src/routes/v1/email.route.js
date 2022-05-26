const express = require('express');
const validate = require('../../middlewares/validate');
const emailValidation = require('../../validations/email.validation');
const emailController = require('../../controllers/email.controller');
const router = express.Router();

router.post('/', validate(emailValidation.sendContactUsEmail), emailController.sendContactUsEmail);
module.exports = router;
