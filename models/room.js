const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    roomNumber: {
        type: String,
        required: true
    },
    images:[{
        imageId:{
        type: String,
        required: true
    },
        ImageUrl:{
        type: String,
        required: true
    }
    }],
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Categories',
        required: true
    },
}, {timeStamps: true});

exports.roomModel = mongoose.model('Rooms', roomSchema)