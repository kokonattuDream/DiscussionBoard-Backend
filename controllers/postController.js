const Post = require("../models/post");
const Cache = require("../lib/cache");

exports.createPost = async (req, res) => {
  try {
    if(req.session.user){
      let data = JSON.parse(req.body.data);
      
      let newPost = await Post.create({
        title: data.title,
        user: req.session.user._id,
        text: data.text,
        createDate: new Date(),
        updatedDate: new Date(),
        category: data.category,
        region: data.region
      });
      
      if (req.file) {
        newPost.imageId = req.file.public_id;
        newPost.imageUrl = req.file.url;
      }
      await newPost.save();
      newPost.user = {
        username: req.session.user.username
      };
      
      Cache.set(JSON.stringify(newPost._id), newPost);
      res.status(201).json({ message: "Post created successfully" });
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
    let allPosts;
    if(Object.keys(Cache.data).length === 0){
      allPosts = await Post.find()
        .populate("user", "username")
        .sort({ updated_date: -1 });
      
      await Promise.all(allPosts.map(post =>{
          Cache.set(JSON.stringify(post._id), post);
      }));
    } else {
      allPosts = [];

      await Promise.all(Object.keys(Cache.data).map(key =>{
        allPosts.push(Cache.get(key));
      }));

      allPosts.sort((x,y)=>{
        if(x.updatedDate < y.updatedDate){
          return 1;
        } else if(x.updatedDate > y.updatedDate){
          return -1;
        } else {
          return 0;
        }
      });
    }
    res.status(200).json({ posts: allPosts });
  } catch (err) {
    console.error("Error: " + err);
    res.status(500).send(err);
  }
};

exports.getPost = async(req, res) => {
    try {
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
        console.error("Error: " + error);
        res.status(500).send(error);
    }
}
