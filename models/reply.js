const mongoose = require('mongoose');

const replySchema = mongoose.Schema({
    author: {type: String},
    content: {type: String},
    date: {type: Date}
});

module.exports = mongoose.model('Reply', replySchema); 