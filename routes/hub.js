const express = require('express');
const router = express.Router();

const hub_controller = require('../controllers/hubController');
const login_controller = require('../controllers/logInController');
const signup_controller = require('../controllers/signUpController');
const message_controller = require('../controllers/messageController');

module.isMember = (req, res, next) => {
    if (req.isAuthenticated() && req.user.membership === true) {
        next();
    } else {
        res.redirect('/hub/log-in');
    }
}

//Home Page
router.get('/', (req, res, next) => {
    hub_controller.hubIndex(req, res, next);
});

//Log in Page
router.get('/log-in', (req, res, next) => {
    res.render('log-in-form', {
        title: 'Log In'
    })    
});
router.post('/log-in', login_controller.logIn_post);

//Sign up Page
router.get('/sign-up', (req, res, next) => {
    res.render('sign-up-form', {
        title: 'Sign Up'
    })
});
router.post('/sign-up', signup_controller.signUp_post);

//Log out
router.get('/log-out', (req, res, next) => {
    req.logout(function(err){
        if (err) {
            return next(err);
        }
        res.redirect('/hub');
    })
});

//Message Page
router.get('/message', module.isMember, message_controller.message_get);
router.post('/message', module.isMember, message_controller.message_post);

module.exports = router;