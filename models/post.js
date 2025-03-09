const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title:String,
    description:String,
    userId:{type: mongoose.Schema.Types.ObjectId,ref: 'User'}

})

const Post = mongoose.model('Post',postSchema);


    
