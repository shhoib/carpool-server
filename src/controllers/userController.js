const User = require("../model/userSchema")


const signupUser= async (req,res)=>{
    try{
        const {email,displayName} = req.body;

        const existingUser = User.findOne({email})

        if(!existingUser){
            const user = new User({name:displayName,email:email})
            await user.save();
            res.json({message: "user registered successfully"})
        }else{
            console.log("user already registered");
        }
    }catch(error){
        console.log(error);
    }
}
  
module.exports = {signupUser}