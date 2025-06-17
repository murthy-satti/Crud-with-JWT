const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const userRoutes = require("./Routes/details.js");
const registerRoutes = require ('./Routes/register.js')
const authenticateToken = require('./Middleware/Auth.js')
const otpRoutes = require ('./Routes/nodemailer.js')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://murthysatti:Tommypilli@1.79tnbjs.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch(() => {
    console.log("Error in connecting MongoDB");
});

// Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Pass upload to routes
app.use("/api/img", userRoutes(upload));
app.use("/api", authenticateToken, userRoutes(upload));
app.use('/reg', registerRoutes())
app.use('/reg', registerRoutes())

app.use('/send',otpRoutes)

app.listen(3000, () => {
    console.log("Server created successfully");
});
