const User = require("../models/user");
const passwordHelper = require("../lib/passwordHelper");

exports.createUser = async (req, res) => {
    if(!req.body.username || !req.body.password){
        return res.status(400).json({error: 'Cannot submit empty fields'});
    }
    if(req.body.password !== req.body.confirmPassword){
        return res.status(400).json({error: 'Password not match'});
    }

    if(req.body.password.length <= 5){
        return res.status(400).json({error: 'Password must be longer than 5 characters'});
    }

    try{
        let user = await User.findOne({'username': req.body.username});
        if (user) {
            return res.status(409).json({error: 'Username already exist'});
        }
        let newUser = new User({
            username: req.body.username,
            password: passwordHelper.encryptPassword(req.body.password)
        });


        await newUser.save();

        req.session.user = {
            _id: newUser._id,
            username: newUser.username
        };

        return res.status(201).json({
            message: 'User successfully created', 
            user: {
                username: newUser.username
            }
        });
    } catch (err){
        console.error(err);
        return res.status(500).json({error: err});
    }
}

exports.loginUser = async (req, res) => {
    if(!req.body.username || !req.body.password){
        return res.status(400).json({error: 'Cannot submit empty fields'});
    }
    try{
        let user = await User.findOne({'username': req.body.username});
        
        if(!user){
            return res.status(404).json({error: 'Username not found'}); 
        }

        if(!passwordHelper.checkPassword(req.body.password, user.password)){
            return res.status(401).json({error: 'Password is incorrect'});
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
    } catch(err){
        console.error(err);
        return res.status(500).json({error: err});
    }
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
