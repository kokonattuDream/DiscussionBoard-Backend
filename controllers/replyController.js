const Reply = require("../models/reply");
const Post = require("../models/post");
const Cache = require("../lib/cache");

exports.addReply = async (req, res) => {
    try {
      if(req.session.user){
        let postId = req.body.post;
        let postModel = await Post.findById(postId);
        
        let replyModel = Reply({
          user: req.session.user._id,
          text: req.body.reply,
          date: new Date()
        });

        await replyModel.save();
        postModel.replies.push(replyModel._id);
        postModel.updatedDate = replyModel.date;
        await postModel.save();
        
        let replyWithUsername = JSON.parse(JSON.stringify(replyModel));

        replyWithUsername.user = {
          username: req.session.user.username
        }

        let postCache = Cache.get(JSON.stringify(postId));
        
        if(postCache){
          postCache.updatedDate = postModel.updatedDate;
          postCache.replies.push(replyWithUsername);
          Cache.set(JSON.stringify(postId), postCache);
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
