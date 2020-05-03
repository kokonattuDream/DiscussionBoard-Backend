const passport = require('passport');
const User = require('../models/user');

exports.createUser = (req, res, next) => {

    if(!req.body.username || !req.body.password){
        return res.status(200).json({error: 'Cannot submit empty fields'});
    }

    passport.authenticate('local-signup', (err, user, info) =>{
        if(err){
            return res.status(200).json({error: err});
        }

        if(info){
            return res.status(200).json({error: info});
        }

        return res.status(201).json({message: 'User successfully created', user: user});
    })(req, res, next);
}

exports.loginUser = (req, res, next) => {
    //console.log(req);
    if(!req.body.username || !req.body.password === undefined){
        return res.status(200).json({error: 'Cannot submit empty fields'});
    }
    
    passport.authenticate('local-login', (err, user, info) =>{
        if(err){
            return res.status(200).json({error: err});
        }

        if(info){
            return res.status(200).json({error: info});
        }

        return res.status(200).json({message: 'User successfully logined', user: user});
    })(req, res, next);
}