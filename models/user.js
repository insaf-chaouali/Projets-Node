const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    email: {required: true, type: String, unique: true},
    age: Number,

});
module.exports = mongoose.model('User', userSchema)