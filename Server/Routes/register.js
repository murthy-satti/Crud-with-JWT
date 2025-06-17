const express = require('express')
const Registeruser = require('../Model/register')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const registerRoutes = () => {
    const router = express.Router()
    const SECRET_KEY = 'MurthySuperKey123';

    //post req to register
    router.post('/new', async (req, res) => {
        const { name, email, phone, password } = req.body
        try {
            if (password.length < 6) {
                return res.status(400).json({ msg: "Password must be at least 6 characters" });
            }
            const hashedPassword = await bcrypt.hash(password, 8)//bcrypt

            const user = await Registeruser.create({ name, email, phone, password: hashedPassword })

            const token = jwt.sign(//jwt
                { id: user._id, email: user.email },
                SECRET_KEY,
                { expiresIn: '30m' }
            );
            return res.status(200).json({ msg: "User created succesfully", token: token })

        } catch (error) {
            return res.status(400).json({ msg: "Error occured while registering", error: error.message })
        }
    })

    //post req to  login
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await Registeruser.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: "Invalid email or password" });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ msg: "Invalid email or password" });
            }

            const token = jwt.sign(
                { id: user._id, email: user.email },
                SECRET_KEY,
                { expiresIn: '30m' }  // keep low for testing; increase for production
            );

            res.status(200).json({ message: 'Login Successful', token });
        } catch (error) {
            return res.status(500).json({ msg: "Error occurred during login", error: error.message });
        }
    });



    //get req
    router.get('/get', async (req, res) => {
        try {
            const users = await Registeruser.find()
            return res.status(200).json({ msg: "User retrived succesfully", users })

        } catch (error) {
            return res.status(400).json({ msg: "Error occured while get req", error: error.message })

        }
    })

    //del req
    router.delete('/del/:id', async (req, res) => {
        const id = req.params.id
        try {
            const delUser = await Registeruser.findByIdAndDelete(id)
            return res.status(200).json({ msg: "User deleted succesfully", delUser })

        } catch (error) {
            return res.status(400).json({ msg: "Error occured while deleting user", error: error.message })

        }
    })

    return router
}

module.exports = registerRoutes