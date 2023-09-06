    const User = require("../model/userSchema")
    const rides = require('../model/rideSchema')
    const bcrypt = require("bcrypt")
    const jwt = require('jsonwebtoken')

 
    //////////signup////////
    const signup= async (req,res)=>{
            const {email,password,username} = req.body;
       
            const token = jwt.sign({username},'secretKey')

            const existingUser = await User.findOne({email})
            if(!existingUser){
                const hashedPasssword = await bcrypt.hash(password,10)
                const user = new User({name:username,email:email,password:hashedPasssword}) 
                await user.save();
                
                const savedUser = await User.findOne({email})
                const userID = savedUser._id;

                res.status(201).json({message: "Account created successfully, Logging In",token,userID})
            }else{
                const userID = existingUser._id;
                res.json({message:"user already registered",token,userID});
            }
        }

     /////////signupWith googleAuth///////////
     
     const signupWithGoogleAuth = async(req,res)=>{
        const {email,displayName} = req.body;

        const token = jwt.sign({displayName},'secretKey')

        const existingUser = await User.findOne({email})
        if(!existingUser){
            const user = new User ({name:displayName,email:email});
            await user.save();

            const savedUser = await User.findOne({email})
            const userID = savedUser._id;

            res.status(201).json({message:'Account created successfully, Logging In',token,userID})
        }else{
            const userID = existingUser._id;
            res.json({message:'user already registered',token,userID})
        }
     }
    
 
    //////////login/////////

    const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        const username = user.name;
        const userID = user._id;
        if (passwordMatch) {
            const token = jwt.sign(user.name,'secretKey')
            res.status(200).json({ message: "user logged in successfully",token,username,userID });
        } else {
            res.status(209).json({ message: "username or password mismatch" });
        }
    } else {
        res.status(204).json({ message: "please register first, Redirecting to signup" });
    }
};



////////////login googleAuth///////////

  const loginWithGoogleAuth = async(req,res)=>{
    const { email } = req.body;
    const user = await User.findOne({ email });
    const userID = user._id

    if(user){
        const token = jwt.sign(user.name,'secretKey')
        res.status(201).json({message:"user logged in succesfully", token,userID})
    }else{
        res.status(209).json({message:'no user found, Redirecting to SignUp'})
    }
  }



    ////////hostRide////////

    const hostRide = async (req,res)=>{
        const {from,to,date,passengers,vehicle,amount,hoster,hosterID} = req.body;
        const ride = new rides({from:from,to:to,date:date,passengers:passengers,vehicle:vehicle,
            amount:amount,hoster:hoster,hosterID:hosterID})
        await ride.save();
        res.status(201).json({message:"ride hosted completely"})
    }

    ///////////joinRide///////////

    const joinRide = async (req, res) => {
        const { from, to, date } = req.query;
         const availableRides = await rides.find({ from,to,date });
         if(availableRides){
             res.json({message:"available rides", rides: availableRides });
            }else{
                res.json({message:"no rides available"})
            }
       
    };
 
    /////////userDetails///////

    const rideDetails = async(req,res)=>{
        const id = req.params.id;
        const ride = await rides.findById({_id:id})
        res.status(200).json({ride:ride})
       
    }

    module.exports = {signup,login,hostRide,joinRide,loginWithGoogleAuth,signupWithGoogleAuth,rideDetails};