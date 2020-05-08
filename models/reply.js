const mongoose = require('mongoose');

const replySchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    text: {type: String},
    post:  {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    date: {type: Date}
});

module.exports = mongoose.model('Reply', replySchema); 