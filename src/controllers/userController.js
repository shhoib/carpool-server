const User = require("../model/userSchema")

//////////signup////////
const signup= async (req,res)=>{
  
        const {email,displayName} = req.body;

        const existingUser = await User.findOne({email})

        if(!existingUser){
            const user = new User({name:displayName,email:email})
            await user.save();
            res.status(201).json({message: "logged in successfully"})
        }else{
            res.json({message:"user already registered"});
        }
    }
   

//////////login/////////

const login = async (req,res)=>{
    const {email} = req.body;

    const existingUser =  await User.findOne({email});
    if(existingUser){
        res.status(200).json({message:"user logged in successfully"})
    }else{
        res.status(400).json({message:"please signup first"})
    }

}


module.exports = {signup,login};