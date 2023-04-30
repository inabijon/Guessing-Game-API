const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    avatar: {
        type: String,
        default: () => {
            return `https://avatars.dicebear.com/api/initials/${this.username}.svg`
        }
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
})

const User = mongoose.model('User', userSchema);
exports.User = User;