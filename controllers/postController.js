const Post = require("../models/post");
const User = require("../models/user");
const Reply = require("../models/reply");
const Cache = require("../lib/cache");

exports.createPost = async (req, res) => {
  try {
    if(req.session.user){
      let data = JSON.parse(req.body.data);
      
      let newPost = Post({
        title: data.title,
        user: req.session.user._id,
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
      let post_with_id = await newPost.save();
      let post_json = JSON.parse(JSON.stringify(post_with_id));
    
      post_json.user = {
        username: req.session.user.username
      };

      Cache.set(JSON.stringify(post_json._id), post_json);
      
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
    let all_posts;
    if(Object.keys(Cache.data).length === 0){
      all_posts = await Post.find()
        .populate("user", "username")
        .sort({ updated_date: -1 });
      
      await Promise.all(all_posts.map(post =>{
          Cache.set(JSON.stringify(post._id), post);
      }));
    } else {
      all_posts = [];

      await Promise.all(Object.keys(Cache.data).map(key =>{
        all_posts.push(Cache.get(key));
      }));

      all_posts.sort((x,y)=>{
        if(x.updated_date < y.updated_date){
          return 1;
        } else if(x.updated_date > y.updated_date){
          return -1;
        } else {
          return 0;
        }
      });
    }
    res.status(200).json({ posts: all_posts });
  } catch (err) {
    console.log("Error: " + err);
    res.status(500).send(err);
  }
};

exports.getPost = async(req, res) => {
    try {
        if(!req.params.id){
            console.error("No Post id");
            res.status(400).send("No Post id");
        }
        let post = null;

        post = Cache.get(req.params.id);
        if(post){
          res.status(200).json({ post: post });
        } else {
          post = await Post.findOne({_id: req.params.id})
          .populate("user", "username")
          .populate({
            path:'replies',
            populate: { path: "user", select:"username" }
          });

          if(!post){
            res.status(404).send("Post not found");
          } else {
            Cache.set(JSON.stringify(post._id), post);
            res.status(200).json({ post: post });
          }
        }
    } catch (error){
        console.log("Error: " + error);
        res.status(500).send(error);
    }
}
