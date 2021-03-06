const Post = require("../models/post");
const Cache = require("../lib/cache");

exports.createPost = async (req, res) => {
  try {
    if(req.session.user){
      let data = JSON.parse(req.body.data);
      
      let postModel = new Post({
        title: data.title,
        user: req.session.user._id,
        text: data.text,
        createDate: new Date(),
        updatedDate: new Date(),
        category: data.category,
        region: data.region
      });
      
      if (req.file) {
        postModel.imageId = req.file.public_id;
        postModel.imageUrl = req.file.url;
      }
      await postModel.save();

      let postObject = postModel.toObject();
      postObject.user = {
        username: req.session.user.username
      };
      Cache.set(JSON.stringify(postModel._id), postObject);
      return res.status(201).json({ message: "Post created successfully" });
    } else {
      return res.status(401).json({ message: "Login Required" });
    }
  } catch (err) {
    console.error("Error: " + err);
    return res.status(500).send(err);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    let allPosts;
    if(Object.keys(Cache.data).length === 0){
      allPosts = await Post.find()
        .populate("user", "username")
        .populate({
          path:'replies',
          populate: { path: "user", select:"username" }
        })
        .sort({ updatedDate: -1 });
      
      await Promise.all(allPosts.map(post =>{
          Cache.set(JSON.stringify(post._id), post.toObject());
      }));
    } else {
      allPosts = [];

      await Promise.all(Object.keys(Cache.data).map(key =>{
        allPosts.push(Cache.get(key));
      }));
      allPosts.sort((x,y)=>{
        let dateX = x.updatedDate;
        let dateY = y.updatedDate;
        if(dateX < dateY){
          return 1;
        } else if(dateX > dateY){
          return -1;
        } else {
          return 0;
        }
      });
    }
    return res.status(200).json({ posts: allPosts });
  } catch (err) {
    console.error("Error: " + err);
    return res.status(500).send(err);
  }
};

exports.getPost = async(req, res) => {
    try {
        let post = Cache.get(JSON.stringify(req.params.id));
        if(post){
          return res.status(200).json({ post: post });
        } else {
          post = await Post.findOne({_id: req.params.id})
          .populate("user", "username")
          .populate({
            path:'replies',
            populate: { path: "user", select:"username" }
          });
          if(!post){
            return res.status(404).send("Post not found");
          } else {
            Cache.set(JSON.stringify(post._id), post.toObject());
            return res.status(200).json({ post: post });
          }
        }
    } catch (error){
        console.error("Error: " + error);
        return res.status(500).send(error);
    }
}
