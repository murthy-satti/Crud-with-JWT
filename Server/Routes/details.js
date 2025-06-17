const express = require("express");
const User = require("../Model/details");

const userRoutes = (upload) => {
    const router = express.Router();


    //post req
    router.post('/add', upload.single("image"), async (req, res) => {
        const { name, email, phoneNumber, Address } = req.body;
        try {
            const user = await User.create({
                name, email, phoneNumber, Address, image: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                    filename: req.file.originalname
                }
            });
            res.status(200).json({ msg: "User created successfully", userName: user.name });
        } catch (error) {
            res.status(400).json({ msg: "Error occurred in post request", error: error.message });
        }
    });

    //get req
    // router.get('/get', async (req, res) => {
    //     try {
    //         const allUsers = await User.find({}, { "image.data": 0 });
    //         res.status(200).json({ msg: "Users retrieved successfully", allUsers });
    //     } catch (error) {
    //         res.status(400).json({ msg: "Error occurred in get request", error: error.message });
    //     }
    // });
    router.get('/get', async (req, res) => {
        try {
            const skip = parseInt(req.query.skip) || 0;
            const limit = 5;

            const allUsers = await User.find({}, { "image.data": 0 })
                .skip(skip)
                .limit(limit);

            const total = await User.countDocuments();

            res.status(200).json({
                msg: "Users retrieved successfully",
                allUsers,
                hasMore: skip + limit < total
            });
        } catch (error) {
            res.status(400).json({ msg: "Error occurred in get request", error: error.message });
        }
    });



    //get req for images
    router.get('/geti/:id', async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user || !user.image || !user.image.data)
                return res.status(404).send('Image not found');
            res.set('Content-Type', user.image.contentType);
            res.send(user.image.data);
        } catch {
            res.status(500).send('Error retrieving image');
        }
    });


    //update req
    router.put('/update/:id', upload.single("image"), async (req, res) => {
        const { id } = req.params;
        const { name, email, phoneNumber, Address } = req.body;
        const updateData = { name, email, phoneNumber, Address };

        if (req.file) {
            updateData.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
                filename: req.file.originalname
            };
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!updatedUser)
                return res.status(404).json({ msg: "User not found" });
            res.status(200).json({ msg: "Update request done successfully", updatedUser });
        } catch (error) {
            res.status(400).json({ msg: "Error occurred in update request", error: error.message });
        }
    });


    //delete req
    router.delete('/delete/:id', async (req, res) => {
        try {
            const delUser = await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ msg: "Delete request done successfully", delUser });
        } catch (error) {
            res.status(400).json({ msg: "Error occurred in delete request", error: error.message });
        }
    });

    return router;
};

module.exports = userRoutes;
