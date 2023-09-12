    const User = require("../model/userSchema")
    const rides = require('../model/rideSchema')
    const Chat = require('../model/chatSchema')
    const bcrypt = require("bcrypt")
    const jwt = require('jsonwebtoken')

 
    //////////signup////////
    const signup= async (req,res)=>{
            const {email,password,username,phoneNumber} = req.body;
       
            const token = jwt.sign({username},'secretKey')

            const existingUser = await User.findOne({email})
            if(!existingUser){
                const hashedPasssword = await bcrypt.hash(password,10)
                const user = new User({name:username,email:email,password:hashedPasssword,
                    phoneNumber:phoneNumber,emailVerified:false,phoneNumberVerified:false}) 
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
            const user = new User ({name:displayName,email:email,emailVerified:true,phoneNumberVerified:false});
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
        if (passwordMatch) {
            const token = jwt.sign(user.name,'secretKey')
            res.status(200).json({ message: "user logged in successfully",token,user });
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

    if(user){
        const token = jwt.sign(user.name,'secretKey')
        res.status(201).json({message:"user logged in succesfully", token,user})
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

    ////////hosterDetails///
    const hosterDetails = async(req,res)=>{
        const id = req.params.id;
        const hoster = await User.findById({_id:id}) 
        res.status(200).json({hoster})
    }
 
    const EditPersonalDetails = async(req,res)=>{ //TODO : update not completed some axios error
        const {name,email,phoneNumber,DOB,about,userID} = req.body;

        const updateFields = {
            name:name,
            email:email,
            phoneNumber:phoneNumber,
            DOB:DOB,
            about:about
        };

        const updatedUser = await User.findByIdAndUpdate(userID, updateFields, { new: true });

        console.log(updatedUser);
        res.status(200).json({message:"profile updated succesfully"})
    }


    ///////////editPassword////////
    const EditPassword = async(req,res)=>{
        const {oldPassword,newPassword,userID} = req.body;
        const user = await User.findOne({ _id:userID });

        const passwordMatch = await bcrypt.compare(oldPassword, user.password)
        
        if(passwordMatch){
            const hashedPassword = await bcrypt.hash(newPassword,10)
            const newPASSWORD = {
                password:hashedPassword
            }            
            const updatedPassword = await User.findByIdAndUpdate(userID,newPASSWORD, {new:true});
            res.status(200).json({message:"Password updated successfully",updatedPassword})
        }else{
            res.status(209).json({message:"The password you entered is not your current password"})
        }
    }


    //////////myRIdes/////
    const myRides = async(req,res)=>{
        const ID = req.params.id; 
         const myrides = await rides.find({hosterID:ID});
         if(myrides){
            res.status(200).json({message:'your rides',myrides})
         }else{
            res.status(209).json({message:"you have not hosted any ride"})
         }
    }


    //////////fetchChat///////////
    const fetchChat =async(req,res)=>{
        const {hosterId,userId} = req.query
        // console.log(hosterId,userId);

        const isChat = await Chat.findOne({userID:userId,hosterID:hosterId});

        if(isChat){
            res.status(200).json({chat:isChat})
        }else{
            const newChat = new Chat({userID:userId,hosterID:hosterId})
            await newChat.save()
            res.status(201).json({chat:newChat})
        }
    }
 
    module.exports = {signup,login,hostRide,joinRide,loginWithGoogleAuth,signupWithGoogleAuth,rideDetails,
        hosterDetails,EditPersonalDetails,EditPassword,myRides,fetchChat};