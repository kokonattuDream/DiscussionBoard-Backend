const passport = require('passport');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
    console.log(req.body);
    if(!req.body.username || !req.body.password){
        return res.status(200).json({error: 'Cannot submit empty fields'});
    }

    passport.authenticate('local-signup', (err, user, info) =>{
        if(err){
            console.error(err);
            return res.status(200).json({error: err});
        }

        if(info){
            return res.status(200).json({error: info});
        }
        let res_user = {
            username: user.username
        };
        return res.status(201).json({message: 'User successfully created', user: res_user});
    })(req, res, next);
}

exports.loginUser = async (req, res, next) => {
    console.log(req.body);
    if(!req.body.username || !req.body.password === undefined){
        return res.status(200).json({error: 'Cannot submit empty fields'});
    }
    
    passport.authenticate('local-login', (err, user, info) =>{
        if(err){
            console.error(err);
            return res.status(200).json({error: err});
        }

        if(info){
            return res.status(200).json({error: info});
        }

        let res_user = {
            username: user.username
        };

        return res.status(200).json({message: 'User successfully logined', user: res_user});
        
        
    })(req, res, next);
}

exports.logoutUser = (req, res) =>{
    res.status(200).json({message: 'User successfully log out'});
    /** 
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.status(500).json({message: 'User log out failed'});
        } else {
            res.status(200).json({message: 'User successfully log out'});
        }
    });*/
}