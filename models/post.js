const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createDate: {type: Date, required: true},
    updatedDate: {type: Date, required: true},
    category: {type: String, required: true},
    region: {type: String, required: true},
    text: {type:String},
    replies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reply'}],
    imageId: {type: String, default: ''},
    imageUrl: {type: String, default: ''}
});

module.exports = mongoose.model('Post', postSchema);