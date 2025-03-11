const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },isAdmin:{
        type:Boolean,
        default:false
    },
    isSuperAdmin:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type: Boolean,
        default: false

    },
},{timestamps: true});

exports.userModel = mongoose.model('User', userSchema);

