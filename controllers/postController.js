const Post = require('../models/post');
const User = require('../models/user');
const cloudinary = require('cloudinary');
const env = require('../env');

cloudinary.config(env.dev.image_src);

exports.createPost = async(req, res) => {

    console.log(req.body);

    try{

        let user = await User.findOne({'username': req.body.username});
        
        if(!user){
            res.status(404).send("username not found!");
        }

        let newPost = Post({
            title: req.body.title,
            user: user,
            create_date: new Date(),
            updated_date: new Date(),
            category: req.body.category,
            region: req.body.region,
            replies: []
        });

        if(req.body.image){
            let result = cloudinary.uploader.upload(req.body.image);
            newPost.imageId = result.public_id;
            newPost.imageVersion = result.version;
        }
        
        await newPost.save();

        return res.status(200).json({message: 'Post created successfully'});

    } catch (err) {
        console.log('Error: ' + err);
        res.status(500).send(err);
    }
    
}

exports.getAllPosts = async (req, res) => {
    try{

        let all_posts = await Post.find().populate("user","username").sort({updated_date: -1});
    
        return res.status(200).json({posts: all_posts});
    } catch (err){
        console.log('Error: ' + err);
        res.status(500).send(err);
    }
    
}

exports.addReply = async(req, res) => {

}