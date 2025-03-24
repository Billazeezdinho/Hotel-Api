const {userModel} = require("../models/user");
require('dotenv').config()
const jwt = require('jsonwebtoken');  
const bcrypt = require("bcrypt");
const signUp = require("../utils/verifyMail");
const sendMail = require("../utils/nodeMailer");

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const userExists = await userModel.findOne({ email});
    if (userExists) {
      return res.status(400).json({
        message: `Email ${email} already exists`
      });
    }
    // console.log(userExists);
    // const salt = await 
    const hashedPassword = await bcrypt.hash(password, 10);
      const user = new userModel({
      fullName,
      email,
      password: hashedPassword
    });
    const token = await jwt.sign({ userId: user._id }, process.env.key, { expiresIn: "10mins" });
    const link = `${req.protocol}://${req.get("host")}/api/v1/verify-user/${token}`;
    const firstName = user.fullName.split(" ")[0];
    const mailDetails = {
      email: user.email,
      subject: "Welcome to AI podcast",
      html: signUp(link, firstName),
    };
    await user.save();
    await sendMail(mailDetails);
    res.status(200).json({
      message: "User registered successfully",
      data: user
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// exports.verifyUser = async (req, res) =>{
//   try{
//     const { token } = req.params;
//     const decodedToken =  await jwt.verify(token, process.env.key)
//     const user = await userModel.findById(decodedToken.userId);
//     if(user === null ){
//       return res.status(404).json({
//         message: 'User Not found'
//       })
//     };
//     if(user.isVerified = true){
//       message: 'User not found'
//     };
//     if(user.isVerified === true ){
//       return res.status(400).json({
//         message: ' User has already been verified, please proceed to login'
//       })
//     }
//     user.isVerified = true;

//     await user.save();
//     res.status(200).json({
//       message: 'Account Verified Successfully'
//     })
//   }catch{
//     console.error(error.message);
//     if(error instanceof jwt.TokenExpiredError){
//       return res.status(400).json({
//         message: ' Verification Link expired: please resend a new verification link'
//       })
//     }
//     return res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// }; 

exports.verifyUsers = async (req, res)=>{
  try{
    const { token } = req.params;
    await jwt.verify(token, process.env.key, async (error, payload)=>{
      if (error){
        if (error instanceof jwt.JsonWebTokenError){
          const decodedToken = await jwt.decode(token);
          const user = await userModel.findById(decodedToken.userId);
          if(user == null){
            return res.status(404).json({
              message: 'User not Found'
            })
          }
          if(user.isVerified === true){
            return res.status(400).json({
              message: 'User has already been verified, please proceed to login'
            })
          }
       
         const newToken = await jwt.sign({
          userId: user._id}, process.env.key,{ expiresIn : '3mins' });
          const link = `${req.protocol}://${req.get('host')}/api/v1/verify-user/${newToken}`;
          const firstName = user.fullName.split(' ')[0];
          const mailDetails = {
            email: user.email,
            subject: 'Verification Link',
            html: signUp(link, firstName)
          }
          await sendMail(mailDetails);
          res.status(200).json({
            message: 'Link expired: A new verification link was sent, please check your email'
          })
        }

        }else{
          console.log(payload )
          const user = await userModel.findById(payload.userId);
          if (user === null){
            return res.status(404).json({
              message: 'User not found'
            })
          }
          if(user.Verified === true){
            return res.status(400).json({
              message: ' User has already been verified, please proceed to login'
            })
          }
          user.isVerified = true;
          await user.save();
          res.status(200).json({
            message: "Account verified successfully "
          });
      }
    })
  }catch(error){
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

exports.login = async (req, res)=>{
  try{
    const {email, password} = req.body;
    console.log(email)
    if(email == undefined || password == undefined){
      return res.status(400).json({
        message: 'Email and password required'
      })
    }

  const user = await userModel.findOne({email: email.toLowerCase() });
  if(user == null){
    return res.status(404).json({
      message: 'User Not Found'
    })
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if(isPasswordCorrect == false){
    return res.status(400).json({
      message: 'Incorrect Password'
    })
  }
  const token = await jwt.sign({ userId: user._id, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin }, process.env.key, { expiresIn: "1d" });
  res.status(200).json({
    message: 'Logged In Successfully',
    data: user,
    token
  })
  }catch(error){
    console.log(error.message)
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

exports.getAll = async (req, res) =>{
  try{
    const users = await userModel.find();
  res.status(200).json({
    message: "All user's in the database",
    data: users
  })}
  catch(error){
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error'
    })
    
  }

}
exports.resendVerificationEmail = async (req, res) =>{
  try{
    const { email } = req.body;
    if(!email){
      return res.status(400).json({
        message: ' Please enter Email Address'
      })
    };
    const user = await userModel.findOne({email: email.toLowerCase()});
    if (user == null){
      return res.status(404).json({
        message: 'User Not Found'
      })
    };
    if(user.isVerified === true ){
      return res.status(400).json({
        message: 'User has already been verified, please proceed to login'
      })
    }
    const token = await jwt.sign({ userId: user._id }, process.env.key, { expiresIn: "50" });
    const link = `${req.protocol}://${req.get('host')}/api/v1/verify-user/${token}`

    const firstName = user.fullName.split( ' ')[0];

    const mailDetails = {
      email: user.email,
      subject: 'Verification Link',
      html: signUp(link, firstName)
    };
    await sendMail(mailDetails);
    res.status(200).json({
      message: 'New verification link sent, please check your email'
    });

  }catch(error){
    console.log(error.message)
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

exports.makeAdmin = async (req, res)=>{
  try{
    const {id} = req.params;
    const user = await userModel.findById(id);
    if(user == null){
      return res.status(404).json({
        message: 'User not found'
      })
    };
    if(user.isAdmin == true){
      return res.status(400).json({
        message: 'User is already an Admin'
      })
    };

    user.isAdmin = true;
    await user.save()

  }catch(error){
    console.log(error.message)
    res.status(500).json({
      message: ' Internal server Error'
    })
  }
}