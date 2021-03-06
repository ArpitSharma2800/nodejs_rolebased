const jwt = require('jsonwebtoken');
const User = require('../models/registerModel')
const bcrypt = require('bcrypt');

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
    serverCheck: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Server running .."
        });
    },
    //signup
    signup: async (req, res) => {
        try {
            const {
                email,
                password,
                role
            } = req.body
            const user = await User.findOne({
                email
            });
            console.log(user);
            if (user) return res.status(403).json({
                success: 0,
                message: 'Email already exist'
            });
            const hashedPassword = await hashPassword(password);
            const newUser = new User({
                email,
                password: hashedPassword,
                role: role || "basic"
            });
            const accessToken = jwt.sign({
                userId: newUser._id,
                role: newUser.role,
                email: newUser.email
            }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            newUser.accessToken = accessToken;
            await newUser.save();
            return res.status(200).json({
                data: newUser,
                accessToken
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Error Message",
            });
        }
    },
    //sign in
    signin: async (req, res) => {
        try {
            const {
                email,
                password
            } = req.body;

            const user = await User.findOne({
                email
            });
            // console.log(user);
            if (!user) return res.status(404).json({
                success: 0,
                message: 'Email does not exist'
            });
            const validPassword = await validatePassword(password, user.password);
            if (!validPassword) return res.status(503).json({
                success: 0,
                message: 'Password is not correct'
            });
            const accessToken = jwt.sign({
                userId: user._id,
                role: user.role,
                email: user.email
            }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            await User.findByIdAndUpdate(user._id, {
                accessToken
            })
            res.status(200).json({
                data: {
                    email: user.email,
                    role: user.role,
                    _id: user._id
                },
                accessToken
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Error Message",
            });
        }
    },
    //getusers
    getusers: async (req, res) => {
        try {
            const users = await User.find({});
            res.status(200).json({
                data: users
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Error Message",
            });
        }
    },
    //getuser
    getuser: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId);
            if (!user) return next(new Error('User does not exist'));
            res.status(200).json({
                data: user
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Error Message",
            });
        }
    },
    //update user by admin
    updateuser: async (req, res, next) => {
        try {
            const update = req.body
            const userId = req.params.userId;
            await User.findByIdAndUpdate(userId, update);
            const user = await User.findById(userId)
            res.status(200).json({
                data: user,
                message: 'User has been updated'
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Error Message",
            });
        }
    }
};