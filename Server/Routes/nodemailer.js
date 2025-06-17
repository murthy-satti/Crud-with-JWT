const nodemailer = require("nodemailer");
const express = require("express");
const { getMaxListeners } = require("../Model/details");

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "murthysatti321@gmail.com",
        pass: "oqgwnblhchukaewa",
    },
});

router.post("/otp", async (req, res) => {
    const { toEmail, otp } = req.body;

    const mailOptions = {
        from: "murthysatti321@gmail.com",
        to: toEmail,
        subject: "Your OTP Code",
        text: `Your 4 digit OTP is: ${otp}`,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        res.send({ message: "OTP sent", otp: otp });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to send OTP");
    }
});

module.exports = router;
