const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
   
    try{
        let user = await User.findOne({'username': username});

        if (user) {
            return done(null, false, {message: 'User with email already exist'});
        }

        if(req.body.password.length <= 5){
            return done(null, false, 'Password must be longer than 5 characters');
        }

        let newUser = new User({
            username: req.body.username
        });

        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.save();

        return done(null, user);

    } catch(err){
        return done(err);
    }
}));



passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    let user;
    try{
        user = await User.findOne({'username': username});
        if(!user){
            return done(null, false, 'User with email not found');
        }

        if(password.length <= 5){
            return done(null, false, 'Password must be longer than 5 characters');
        }

        if(!user.checkPassword(req.body.password)){
            return done(null, false, 'Password is incorrect');
        }
        
        return done(null, user);

    } catch(err){
        return done(err);
    }
}));

module.exports = passport;