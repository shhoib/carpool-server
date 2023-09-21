    const User = require("../model/userSchema")
    const rides = require('../model/rideSchema')
    const Chat = require('../model/chatSchema')
    const bcrypt = require("bcrypt")
    const jwt = require('jsonwebtoken')
    const cloudinary = require('../cloudinary/cloudinary')
    const path = require('path')

 
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
        console.log(name,phoneNumber);

        const updateFields = {
            name:name, 
            email:email,
            phoneNumber:phoneNumber, 
            DOB:DOB,
            about:about
        };
        // console.log(updateFields);

        const updatedUser = await User.findByIdAndUpdate(userID, updateFields, { new: true });

        // console.log(updatedUser);
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
         const joinedRides = await rides.find({joinerID:ID});
         console.log(joinedRides);
        //  console.log(myrides);
        const allRides = {joinedRides,myrides}
         if(myrides){
            res.status(200).json({message:'your rides',allRides})
         }else{
            res.status(209).json({message:"you have not hosted any ride"})
         }
    }

 
    //////////fetchChat///////////
    const fetchChat =async(req,res)=>{   
        const {toId,fromId} = req.query
        console.log(toId,fromId); 

        const isChat = await Chat.findOne({
        $or: [
            { fromID: fromId, toID: toId },
            { fromID: toId, toID: fromId }   
        ]
    }) 
        // console.log(isChat); 
  
        if(isChat){
            // console.log('chat available');
            res.status(200).json({chat:isChat})
        }else{
            // console.log('not available');
            const newChat = new Chat({fromID:fromId,toID:toId})
            await newChat.save()
            res.status(201).json({chat:newChat})
        }
    }


    //////////fetchChatForNotification///////////
    const fetchChatForNotification =async(req,res)=>{   
        const {toId,fromId} = req.query
        console.log(toId,fromId); 

        const isChat = await Chat.findOne({
        $or: [
            { fromID: fromId, toID: toId },
            { fromID: toId, toID: fromId }   
        ]
    }) 
        // console.log(isChat); 
  
        if(isChat){
            // console.log('chat available');
            res.status(200).json({chat:isChat})
        }else{
            // console.log('not available');
            const newChat = new Chat({fromID:fromId,toID:toId})
            await newChat.save()
            res.status(201).json({chat:newChat})
        }
    }
 

    //////fetchPreviuosChatDetails////////
    const fetchPreviuosChatDetails= async(req,res)=>{
        const {userID} = req.query;

        const isSender = await Chat.find({fromID:userID})
        const isReceiver = await Chat.find({toID:userID})
        // console.log('sender',isSender);
        // console.log('receiver',isReceiver);
            

         const allUsers = [];    

        if(isSender.length>0){  
            for(const chatID of isSender){
                const userDetails = await User.find({_id:chatID.toID});
                // console.log('first',userDetails)
                if(userDetails){
                    allUsers.push(userDetails[0])   //TODO: remove[0] if only getting one user
                }
            }
            // console.log(allUsers);
        }
         if(isReceiver.length>0){ 
            for(const chatID of isReceiver){
                const userDetails = await User.find({_id:chatID.fromID});
                // console.log('second',userDetails)
                if(userDetails){
                    allUsers.push(userDetails[0])   //TODO: remove[0] if only getting one user
                }
            }
        }
        // console.log("last",allUsers);

         res.status(200).json({chattedUsers:allUsers})

    }

        const uploadImage = async(req,res)=>{
            try{ 
                console.log(req.file);
                const uploader = async(path)=> await cloudinary.uploads(path,'profilePic');
                const docs = req.file;
                const {path} = docs;
                const newPath = await uploader(path);
                // console.log("newPath" ,newPath)
                console.log(newPath.url);
                const profileUpdated = new User({profileURL:newPath.url})
                await profileUpdated.save();
                
                res.status(200).send(newPath.url)
            }catch(error){
                console.log(error);
            }
        }

    module.exports = {signup,login,hostRide,joinRide,loginWithGoogleAuth,signupWithGoogleAuth,rideDetails,
        hosterDetails,EditPersonalDetails,EditPassword,myRides,fetchChat,fetchPreviuosChatDetails,
        fetchChatForNotification,uploadImage};