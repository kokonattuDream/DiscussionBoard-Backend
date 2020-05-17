const Reply = require("../models/reply");
const User = require("../models/user");
const Post = require("../models/post");
const Cache = require("../lib/cache");

exports.addReply = async (req, res) => {
    console.log(req.body);
    try {
      if(req.session.user){
        /** 
        let user = await User.findOne({ username: req.body.user });
        console.log(user);
        if (!user) {
          res.status(404).send("username not found!");
        }*/

        let post = await Post.findById(req.body.post);
        
        let newReply = Reply({
          user: req.session.user._id,
          text: req.body.reply,
          date: new Date()
        });

        await newReply.save();
        post.replies.push(newReply._id);
        post.updated_date = newReply.date;

        await post.save();
        
        let replyCache = JSON.parse(JSON.stringify(newReply));
        replyCache.user = {
          username: req.session.user.username
        }
        let postCache = Cache.get(req.body.post);
        if(postCache){
          postCache.updated_date = post.updated_date;
          postCache.replies.push(replyCache);
          Cache.set(req.body.post, postCache);
        }
        
        res.status(200).json({ message: "Reply submitted" });
      } else {
        res.status(403).json({ message: "User Login Required" });
      }
    } catch (err) {
      console.error("Error: " + err);
      res.status(500).send(err);
    }
  };