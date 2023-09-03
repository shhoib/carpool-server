    const User = require("../model/userSchema")
    const rides = require('../model/rideSchema')
    const bcrypt = require("bcrypt")
    const jwt = require('jsonwebtoken')

 
    //////////signup////////
    const signup= async (req,res)=>{
            const {email,displayName,password,username} = req.body;
       
            const token = jwt.sign({username},'secretKey')

            const existingUser = await User.findOne({email})
            if(!existingUser){
                // const hashedPasssword = await bcrypt.hash(password,10)
                const user = new User({name:displayName||username,email:email})  // TODO : save password
                await user.save();
                

                res.status(201).json({message: "logged in successfully",token})
            }else{
                res.json({message:"user already registered",token});
            }
        }
    
 
    //////////login/////////

    const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    const user = await User.findOne({ email });

    if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        const username = user.name;
        if (passwordMatch) {
            const token = jwt.sign(user.name,'secretKey')
            res.status(200).json({ message: "user logged in successfully",token,username });
        } else {
            res.status(209).json({ message: "username or password mismatch" });
        }
    } else {
        res.status(204).json({ message: "please register first, Redirecting to signup" });
    }
};




    ////////hostRide////////

    const hostRide = async (req,res)=>{
        const {from,to,date,passengers,vehicle,amount} = req.body;
        const ride = new rides({from:from,to:to,date:date,passengers:passengers,vehicle:vehicle,amount:amount})
        await ride.save();
        console.log('saved');
        res.status(201).json({message:"ride hosted completely"})
    }

    ///////////joinRide///////////

    const joinRide = async (req, res) => {
        const { from, to, date } = req.query;
         const availableRides = await rides.find({ from,to });
         if(availableRides){
             res.json({message:"available rides", rides: availableRides });
            }else{
                res.json({message:"no rides available"})
            }
       
    };

    module.exports = {signup,login,hostRide,joinRide};