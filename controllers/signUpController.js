const User = require('../models/user');

const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

exports.signUp_post = [
    body('firstname', 'First name must not be empty').trim().escape(),
    body('lastname', 'Last name must not be empty').trim().escape(),
    body('email', 'Email must not be empty').trim().escape(),
    body('password', 'Password must not be empty').trim().escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('sign-up-form', {
                title: 'Sign Up',
                errors: errors.array()
            });
        }
        try{
            const hashPassword = await bcrypt.hash(req.body.password, 10);
        
            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashPassword,
                membership: true
            });

            await user.save();
            res.redirect('/');
        }catch(err){
            if (err.code === 11000) {
                res.render('sign-up-form', {
                    title: 'Sign Up',
                    errors: [{msg: 'Email already in use'}]
                });
            }
            else{
                res.render('sign-up-form', {
                    title: 'Sign Up',
                    errors: [{msg: 'unexpected error'}]
                });
            }
        }
    })
];
