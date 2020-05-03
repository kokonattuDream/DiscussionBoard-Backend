const Post = required('../models/post');

exports.createPost = async(req, res) => {

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

    } catch (err) {
        console.log('Error: ' + err);
        res.status(500).send(err);
    }
    
    return res.status(200).json({message: 'Post created successfully'});
}

exports.getAllPosts = async (req, res) => {
    try{

        let all_posts = await Posts.find({}).sort("updated_date", -1);

    } catch (err){
        console.log('Error: ' + err);
        res.status(500).send(err);
    }
    
    return res.status(200).json({posts: all_posts});
}

exports.addReply = async(req, res) => {
    
}