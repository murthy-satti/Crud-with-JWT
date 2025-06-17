const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true },
    Address: { type: String, default: "Not Provided" },
    image: {
        data: Buffer,
        contentType: String,
        filename: String
    }
});

module.exports = mongoose.model("User", userSchema);
