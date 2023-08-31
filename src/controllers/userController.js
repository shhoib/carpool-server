    const User = require("../model/userSchema")
    const rides = require('../model/rideSchema')
    const bcrypt = require("bcrypt")


    //////////signup////////
    const signup= async (req,res)=>{
    
            const {email,displayName,password,username} = req.body;
       
            const existingUser = await User.findOne({email})
            
            if(!existingUser){
                const hashedPasssword = await bcrypt.hash(password,10)
                const user = new User({name:displayName||username,email:email,password:hashedPasssword})
                await user.save();
                res.status(201).json({message: "logged in successfully"})
            }else{
                res.json({message:"user already registered"});
            }
        }
    
 
    //////////login/////////

    const login = async (req, res) => {
    const { email, password ,username} = req.body;
    console.log(username);
    const user = await User.findOne({ email });

    if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.status(200).json({ message: "user logged in successfully" });
        } else {
            res.status(403).json({ message: "username or password mismatch" });
        }
    } else {
        res.status(404).json({ message: "please register first" });
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