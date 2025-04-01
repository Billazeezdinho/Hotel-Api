const jwt = require('jsonwebtoken')
const { userModel } = require('../models/user')
exports.authenticate = async (req, res, next) =>{
    try{
        const auth = req.header('Authorization')
        if(auth == undefined){
            return res.status(401).json({
                message: 'Token Not Found'
            })
        }
        
        const token = auth.split(' ')[1];
        if(token == null){
            return res.status.json({
                message: 'Invalid Token'
            })
        }
       const decodedToken =await jwt.verify(token, process.env.key)
       const user = await userModel.findById(decodedToken.userId);
       if(user == null ){
        return res.status(404).json({
            message: 'Authentication Failed: User not Found'
        })
       }
       if(!user.isAdmin ){
        return res.status(403).json({
            message: 'Unauthorized: Not an Admin'
        })
       }
       req.user = decodedToken;
       next();

    }catch(error){
        if(error instanceof jwt.TokenExpiredError){
            return res.status(401).json({
                message: 'Session timed-out, please login to continue'
            })
        }
        console.log(error.message)
        res.status(500).json({
            message: 'Internal Server Error' + error.message
        })
    }
}

exports.adminAuth = async (req, res) =>{
    try{
        if(req.user.isAdmin == true){
            next()
        }else{
            res.status(403).json({
                message: " Unauthorized: Not an Admin"
            })
        }

    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message: 'Internal Server error'
        })
    }
}
exports.superAdminAuth = async (req, res) =>{
    try{
        if(req.user.isSuperAdmin == true){
            next()
        }else{
            res.status(403).json({
                message: " Unauthorized: You're not allowed to perform this action"
            })
        }

    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message: 'Internal Server error'
        })
    }
}