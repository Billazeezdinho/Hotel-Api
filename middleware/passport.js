const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const { userModel } = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.client_Id,
    clientSecret: process.env.client_Key,
    callbackURL: "http://localhost:1548/auth/google/login"
  },
  async(accessToken, refreshToken, profile, cb) => {
    try {
        let user = await userModel.findOne({email: profile.emails[0].value});
        if(!user ){
            user = new userModel({
                email: profile.emails[0].value,
                fullName: profile.displayName,
                isVerified: profile.emails[0].isVerified,
                password: ''
            })
            await user.save();
        }
        return cb(null, user);
    } catch (error) {
        return cb(error, null)
        
    }
  }
));

passport.serializeUser((user, cb)=>{
    console.log('User serializerUser');
    
    cb(null, user.id)
})

passport.deserializeUser(async(id, cb)=>{
    try {
        const user = await userModel.findById(id);
        if(!user){
            return cb(new Error('User Not Found'), null);
            cb(null, user);
        }
    } catch (error) {
        cb(error, null)
    }
})  

module.exports = passport;
