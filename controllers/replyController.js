const Reply = require("../models/reply");
const Post = require("../models/post");
const Cache = require("../lib/cache");

exports.addReply = async (req, res) => {
    try {
      if(req.session.user){
        let postId = req.body.post;
        let post = await Post.findById(postId);
        
        let newReply = Reply({
          user: req.session.user._id,
          text: req.body.reply,
          date: new Date()
        });

        await newReply.save();
        post.replies.push(newReply._id);
        post.updatedDate = newReply.date;
        await post.save();
        
        newReply.user = {
          username: req.session.user.username
        }
        let postCache = Cache.get(JSON.stringify(postId));
        if(postCache){
          postCache.updatedDate = post.updatedDate;
          postCache.replies.push(newReply);
          Cache.set(postId, postCache);
        }
        
        return res.status(201).json({ message: "Reply submitted" });
      } else {
        return res.status(401).json({ message: "User Login Required" });
      }
    } catch (err) {
      console.error("Error: " + err);
      return res.status(500).send(err);
    }
  };
