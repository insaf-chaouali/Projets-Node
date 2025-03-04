const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const userRoutes = require('./routes/user.route');
const app = express();
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('connected to mongodb');
}).catch((err) =>{
    console.log("error connecting",err) 
})


app.use('/users',userRoutes);
const professionalRoutes = require("./routes/professional");
app.use("/api/professional", professionalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(7000,()=>{
    console.log('listening on http://localhost:7000');
});