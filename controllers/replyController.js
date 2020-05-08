const Reply = require("../models/reply");
const User = require("../models/user");
const Post = require("../models/post");

exports.addReply = async (req, res) => {
    console.log(req.body);
  
    try {
      let user = await User.findOne({ username: req.body.user });
      console.log(user);
      if (!user) {
        res.status(404).send("username not found!");
      }

      let post = await Post.findById(req.body.post);
      
      let newReply = Reply({
        user: user,
        text: req.body.reply,
        date: new Date()
      });

      await newReply.save();
      user.replies.push(newReply._id);
      await user.save();
      console.log("user success");
      post.replies.push(newReply._id);
      await post.save();
      console.log("post success");
      
      res.status(200).json({ message: "Reply submitted" });
    } catch (err) {
      console.error("Error: " + err);
      res.status(500).send(err);
    }
  };