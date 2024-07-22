const User = require('../models/user');
const Message = require('../models/message');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

exports.hubIndex = async (req, res, next) => {
  try {
    const messages = await Message.find({}).populate('user').sort({ timestamp: -1 }).exec();
    const membership = req.user ? { username: req.user.fullName, membership: req.user.membership } : null;
    res.render('index', { title: 'Members Only', messages, membership });
  } catch (err) {
    next(err);
  }
};