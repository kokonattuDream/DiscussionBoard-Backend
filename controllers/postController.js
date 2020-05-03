const Post = require('../models/post');

exports.createPost = async(req, res) => {

    console.log(req.body);

    try{
        let newPost = Post({
            title: req.body.title,
            author: req.body.author,
            create_date: new Date(),
            updated_date: new Date(),
            category: req.body.category,
            region: req.body.region,
            replies: []
        });

        await newPost.save();

        return res.status(200).json({message: 'Post created successfully'});

    } catch (err) {
        console.log('Error: ' + err);
        res.status(500).send(err);
    }
    
}

exports.getAllPosts = async (req, res) => {
    try{

        let all_posts = await Post.find();

        return res.status(200).json({posts: all_posts});
    } catch (err){
        console.log('Error: ' + err);
        res.status(500).send(err);
    }
    
}

exports.addReply = async(req, res) => {

}