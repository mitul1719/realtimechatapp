const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Chat = require('../models/chatModel')
// const { generateToken } = require("../config/generateToken");
// const { fireStoreDb } = require("../config/firebase");

module.exports.accessChat = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        res.status(400)

        throw new Error('Bad Request')
    }

    let chatExists = await User.find({
        isGroupChat: false,
        $and: [{ users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: id } } }],
    })
        .populate('users', '-password')
        .populate('latest')

    chatExists = await User.populate(chatExists, {
        path: 'latestMessage.sender',
        select: 'name pic email',
    })

    if (chatExists.length > 0) {
        res.status(200).json({
            ok: true,
            data: chatExists[0],
            error: null,
        })
    } else {
        const createNewChat = {
            chatName: 'sender',
            isGroupChat: false,
            users: [id, req.user._id],
        }

        try {
            const createdCHat = await Chat.create(createNewChat)
            const FullChat = await Chat.findById(createdCHat._id).populate('users', '-password')

            res.status(200).send({ ok: true, data: FullChat, error: null })
        } catch (error) {
            res.status(500).json({ ok: false, data: null, error: error.message })
        }
    }
})

module.exports.fetchChats = asyncHandler(async (req, res) => {
    try {
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 })

        const final = await User.populate(chats, {
            path: 'latestMessage.sender',
            select: 'name pic email',
        })

        res.status(200).json({
            ok: true,
            data: final,
            error: null,
        })
    } catch (error) {}
})

module.exports.createGroup = asyncHandler(async (req, res) => {
    const { name, users } = req.body

    if (!name || !users) {
        res.status(400)

        throw new Error('Bad Request')
    }

    const groupOptions = {
        chatName: name,
        users,
        isGroupChat: true,
        groupAdmin: req.user._id,
    }
    try {
        const createdChat = await Chat.create(groupOptions)

        const populatedChat = await Chat.findOne({
            _id: createdChat._id,
        })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')

        res.status(200).json({
            ok: true,
            data: populatedChat,
            error: null,
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            data: null,
            error,
        })
    }
})

module.exports.renameGroup = asyncHandler(async (req, res) => {
    const { name, id } = req.body

    if (!name || !id) {
        req.status(400)
        throw new Error('Bad Request,provide name and id')
    }

    try {
        const group = await Chat.findById(id).populate('users', '-password').populate('groupAdmin', '-password')

        if (group) {
            group.chatName = name

            const newGroupDetails = await group.save()

            res.status(200).json({
                ok: true,
                data: newGroupDetails,
                error: null,
            })
        } else {
            res.status(500).json({
                ok: true,
                data: null,
                error: 'Something went wrong',
            })
        }
    } catch (error) {
        res.status(500)
        throw new Error('Server Error')
    }
})

module.exports.removeFromGroup = asyncHandler(async (req, res) => {
    const { groupId, memberId } = req.body

    if (!groupId || !memberId) {
        res.status(400)
        throw new Error('Bad Request,provide groupId and memberId')
    }

    try {
        const group = await Chat.findByIdAndUpdate(groupId, {
            $pull: { users: memberId },
        })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
        if (group) {
            res.status(200).json({
                ok: true,
                data: group,
                error: null,
            })
        } else {
            res.status(500).json({
                ok: true,
                data: null,
                error: 'Something went wrong',
            })
        }
    } catch (error) {
        res.status(500)
        throw new Error('Server Error')
    }
})
module.exports.addToGroup = asyncHandler(async (req, res) => {})
