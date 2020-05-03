const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type: String},
    author: {type: String},
    date: {type: Date},
    category: {type: String},
    region: {type: String},
    replies: [{
        reply: {type: mongoose.Schema.Type.ObjectId, ref: 'Reply'}
    }]
});

module.exports = mongoose.model('Post', postSchema);