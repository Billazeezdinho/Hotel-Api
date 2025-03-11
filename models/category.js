const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rooms:[{
        type: mongoose.SchemaTypes.ObjectId, 
        ref: 'Rooms'
    }],
    amenities: { 
        type: String, 
        default: []
    },
    createdBy: {
        adminId: {type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true
         },
        adminName: { 
            type: String,
            required:true
         }
    }
}, {timestamps: true});

exports.categoryModel = mongoose.model('Categories', categorySchema);

