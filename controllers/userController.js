const passport = require('passport');

exports.createUser = (req, res) => {
    if(!req.body.username || !req.body.password){
        return res.status(400).json({error: 'Cannot submit empty fields'});
    }
    
    passport.authenticate('local-signup', (err, user, info) =>{
        if(err || info){
            let message = err || info;
            console.error(message);
            return res.status(500).json({error: message});
        }
        
        let userOnlyName = {
            username: user.username
        };
        req.session.user = user;
        return res.status(201).json({message: 'User successfully created', user: userOnlyName});
    })(req, res);
}

exports.loginUser = async (req, res) => {
    if(!req.body.username || !req.body.password === undefined){
        return res.status(400).json({error: 'Cannot submit empty fields'});
    }
    passport.authenticate('local-login', (err, user, info) =>{
        if(err || info){
            let message = err || info;
            console.error(message);
            if(message === "Username not found"){
                return res.status(404).json({error: message});
            } else {
                return res.status(500).json({error: message});
            }
        }

        let userOnlyName = {
            username: user.username
        };
        req.session.user = user;
        return res.status(200).json({message: 'User successfully logined', user: userOnlyName});
    })(req, res);
}

exports.logoutUser = (req, res) =>{
    req.session.destroy(function(err){
        if(err){
            console.error(err);
            res.status(500).json({message: 'User log out failed'});
        } else {
            res.status(204).json({message: 'User successfully log out'});
        }
    });
}
