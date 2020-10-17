const bcrypt = require('bcrypt-nodejs');

module.exports.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports.checkPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}