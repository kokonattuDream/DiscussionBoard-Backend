const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    username: {type: String},
    password: {type: String},
    posts: [{
        post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
    }],
    replies:[{
        reply: {type: mongoose.Schema.Types.ObjectId, ref: 'Reply'}
    }]
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.checkPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);