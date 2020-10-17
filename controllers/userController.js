const passport = require('passport');

exports.createUser = (req, res) => {
    if(!req.body.username || !req.body.password){
        return res.status(400).json({error: 'Cannot submit empty fields'});
    }
    if(req.body.password !== req.body.confirmPassword){
        return res.status(400).json({error: 'Password not match'});
    }
   
    passport.authenticate('local-signup', (err, user, info) =>{
        if(err){
            console.error(err);
            return res.status(500).json({error: err});
        } else if(info){
            if(info === 'Username already exist'){
                return res.status(409).json({error: info});
            } else {
                return res.status(400).json({error: info});
            }
        }
        
        req.session.user = {
            _id: user._id,
            username: user.username
        };
        return res.status(201).json({
            message: 'User successfully created', 
            user: {
                username: user.username
            }
        });
    })(req, res);
}

exports.loginUser = async (req, res) => {
    if(!req.body.username || !req.body.password === undefined){
        return res.status(400).json({error: 'Cannot submit empty fields'});
    }
    passport.authenticate('local-login', (err, user, info) =>{
        if(info){
            if(info === "Username not found"){
                return res.status(404).json({error: info});
            } else {
                return res.status(401).json({error: info});
            }
        } else if(err){
            console.error(err);
            return res.status(500).json({error: err});
        }
        req.session.user = {
            _id: user._id,
            username: user.username
        };
        return res.status(200).json({
                message: 'User successfully logined', 
                user: {
                    username: user.username,
                }
        });
    })(req, res);
}

exports.logoutUser = (req, res) =>{
    req.session.destroy(function(err){
        if(err){
            console.error(err);
            res.status(500).json({message: 'User log out failed'});
        } else {
            res.clearCookie('connect.sid');
            res.status(204).json({message: 'User successfully log out'});
        }
    });
}
