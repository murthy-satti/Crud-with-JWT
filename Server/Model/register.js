const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String , required :   true , unique : true},
    phone : {type : Number},
    password : {type : String , required : true}
},{
    timestamps: true,
    versionKey : false
})

module.exports = mongoose.model("Register", userSchema)