const Post = require("../models/post");
const User = require("../models/user");
const Reply = require("../models/reply");
const env = require("../env");
const formidable = require('express-formidable');

exports.createPost = async (req, res) => {
  console.log(JSON.parse(req.body.data));
  try {
    if(req.session.user){
      let data = JSON.parse(req.body.data);
      let user = await User.findOne({ username: data.username });
      console.log(user);
      if (!user) {
        res.status(404).send("username not found!");
      }
      
      let newPost = Post({
        title: data.title,
        user: user._id,
        text: data.text,
        create_date: new Date(),
        updated_date: new Date(),
        category: data.category,
        region: data.region
      });

      if (req.file) {
        newPost.imageId = req.file.public_id;
        newPost.imageUrl = req.file.url;
      }

      console.log(newPost);
      await newPost.save();
      
      res.status(200).json({ message: "Post created successfully" });
    } else {
      res.status(403).json({ message: "Login Required" });
    }
  } catch (err) {
    console.error("Error: " + err);
    res.status(500).send(err);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    let all_posts = await Post.find()
      .populate("user", "username")
      .sort({ updated_date: -1 });

    return res.status(200).json({ posts: all_posts });
  } catch (err) {
    console.log("Error: " + err);
    res.status(500).send(err);
  }
};

exports.getPost = async(req, res) => {
    try {
        if(!req.params.id){
            console.log("No Post id");
            res.status(400).send("No Post id");
        }
        let post = await Post.findOne({_id: req.params.id})
          .populate("user", "username")
          .populate({
            path:'replies',
            populate: { path: "user", select:"username" }
          });

        if(!post){
          res.status(404).send("Post not found");
        } else {
          res.status(200).json({ post: post });
        }
      
    } catch (error){
        console.log("Error: " + error);
        res.status(500).send(error);
    }
}
