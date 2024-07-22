const User = require('../models/user');

const passport = require('passport');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

exports.logIn_post = passport.authenticate('local', {
    successRedirect: '/hub',
    failureRedirect: '/hub/log-in',
    failureFlash: true
});