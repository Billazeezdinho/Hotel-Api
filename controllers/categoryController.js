const { categoryModel } = require('../models/category')
const { userModel } = require('../models/user')
exports.createCategory = async (req, res) => {
    try{
        const { userId } = req.user;
        const { name, amenities } = req.body;
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const category = new categoryModel({
            name,
            amenities,
            createdBy:{
                adminId,
                adminName               
            }
        });
        await category.save();
    

        res.status(201).json({
            message: 'Category created Successfully',
            date: category
        })

    } catch(error){
        console.log(error.message)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

exports.getAll = async (req, res) =>{
    try {
        const Categories = await categoryModel.find().populate('roonms', ['roomName', 'price', 'description', 'images'])
        res.status(200).json({
            message: 'All category found successfully',
            data: Categories
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message: 'Internal Server Error'
        })
        
    }
}