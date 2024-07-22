const User = require('../models/user');
const Message = require('../models/message');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

exports.message_get = asyncHandler(async (req, res, next) =>{
    res.render('message-form', {
        title: 'Create Message',
        user: req.user
    })
})

exports.message_post = [
    body('title', 'Title must not be empty').trim().escape(),
    body('text', 'Content must not be empty').trim().escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('message-form', {
                title: 'Create Message',
                errors: errors.array()
            });
            return;
        }

        const message = new Message({
            title: req.body.title,
            text: req.body.text,
            user: req.user._id,
            timestamp: new Date()
        });
        message.save();
        res.redirect('/hub');
    })
]