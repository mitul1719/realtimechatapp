const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const { generateToken } = require('../config/generateToken')
const { fireStoreDb } = require('../config/firebase')

module.exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Bad Request. All fields are required')
    }
    // await User.deleteMany({});
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User alredy exists')
    }

    //   console.log(fireStoreDb.collection("users"));

    //   const userRef = fireStoreDb.collection("users").doc("user");

    //   const resultFromDb = await userRef.set({
    //     name,
    //     email,
    //     password,
    //     pic,
    //   });

    //   res.status(201).json({
    //     result: resultFromDb,
    //   });
    const createdUser = await User.create({
        name,
        email,
        password,
        pic,
    })
    if (createdUser) {
        res.status(201).json({
            ...createdUser._doc,
            token: generateToken(createdUser._id),
        })
    } else {
        res.status(400)
        throw new Error('Couldnt create User')
    }
})

module.exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const userWasFound = await User.findOne({ email })

    if (userWasFound && (await userWasFound.matchPassword(password))) {
        res.status(200).json({
            ...userWasFound._doc,
            token: generateToken(userWasFound._id),
        })
    } else {
        res.status(400)
        throw new Error('User doesnot exist! Please Register')
    }
})

module.exports.googleLogin = asyncHandler((req, res) => {
    console.log(req)
})

module.exports.getAllUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
              $or: [{ name: { $regex: req.query.search, $options: 'i' } }, { email: { $regex: req.query.search, $options: 'i' } }],
          }
        : {}
    const allUsers = await User.find(keyword).find({
        _id: { $ne: req.user._id },
    })

    res.status(200).json({ ok: true, data: allUsers, error: null })
})
