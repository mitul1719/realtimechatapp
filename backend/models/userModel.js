const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        pic: {
            type: String,
            default: 'https://img.icons8.com/?size=512&id=23456&format=png',
        },
    },
    { timestamps: true }
)

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next()
    }

    this.password = bcrypt.hashSync(this.password, 10)
})

const User = mongoose.model('User', userSchema)

module.exports = User
