    const User = require("../model/userSchema")
    const rides = require('../model/rideSchema')

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

    ////////hostRide////////

    const hostRide = async (req,res)=>{
        const {from,to,date,passengers,vehicle} = req.body;
        const ride = new rides({from:from,to:to,date:date,passengers:passengers,vehicle:vehicle})
        await ride.save();
        console.log('saved');
        res.status(201).json({message:"ride hosted completely"})
    }

    ///////////joinRide///////////

    const joinRide = async (req, res) => {
        const { from, to, date } = req.body;
         const availableRides = await rides.find({ from,to });
         res.json({ rides: availableRides });
       
    };

    module.exports = {signup,login,hostRide,joinRide};