    const User = require("../model/userSchema")
    const rides = require('../model/rideSchema')
    const Chat = require('../model/chatSchema')
    const Notification = require('../model/notificationSchema')
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
        const {from,to,date,passengers,vehicle,amount,hoster,hosterID,status} = req.body;
        const ride = new rides({from:from,to:to,date:date,passengers:passengers,vehicle:vehicle,
            amount:amount,hoster:hoster,hosterID:hosterID,status:status})
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
  
        if(isChat){
            res.status(200).json({chat:isChat})
        }else{
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
  
        if(isChat){
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
    
            
 
         const allUsers = [];    

        if(isSender.length>0){  
            for(const chatID of isSender){
                const userDetails = await User.find({_id:chatID.toID});
                if(userDetails){
                    allUsers.push(userDetails[0])   //TODO: remove[0] if only getting one user
                }
            }
        }
         if(isReceiver.length>0){ 
            for(const chatID of isReceiver){
                const userDetails = await User.find({_id:chatID.fromID});
                if(userDetails){
                    allUsers.push(userDetails[0])   //TODO: remove[0] if only getting one user
                }
            }
        }

         res.status(200).json({chattedUsers:allUsers})

    }

        const uploadImage = async(req,res)=>{
            try{ 
                const userID = req.query.id;
                console.log(userID);
                const uploader = async(path)=> await cloudinary.uploads(path,'profilePic');
                const docs = req.file;
                const {path} = docs;
                const newPath = await uploader(path);
                console.log(newPath.url);

                const profileUpdated = await User.findByIdAndUpdate(userID,{ profileURL: newPath.url }, 
                    { new: true } 
                  );
              
                  if (!profileUpdated) {
                    return res.status(404).send("User not found");
                  }
              
                  res.status(200).send(newPath.url);
            }catch(error){
                console.log(error);
            }
        }

        /////////sendNotification////////////////////

        const sendNotification = async (req, res) => {
            try {
                const { senderID, receiverID, message, senderName, type } = req.body;
                const notificationType = type;
                const RECEIVER = await Notification.findOne({ userID: receiverID });
   
                if (!RECEIVER) {
                const createReceiver = new Notification({
                 userID: receiverID,notifications: [{ message: message,senderName: senderName,
                    senderID: senderID, notificationType: type }]});
                    await createReceiver.save();
                res.status(201).json({ notification: createReceiver });
                } else {  
                RECEIVER.notifications.push({ notificationType, message, senderName, senderID});
                await RECEIVER.save();
                res.status(200).json({ notification: RECEIVER });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Server error' });
            }
            };

        //////////////fetchNotification//////////////
        const fetchNotification = async(req,res)=>{
            const userID = req.query.id;
            const notification = await Notification.findOne({userID:userID})
            // console.log(notification);

            if(!notification){
                res.status(209).json({message:'no new notifications'})
            }else{
                res.status(200).json({notification})
            }
        }

        ///////deleteNotification////////
        const deleteNotification = async (req, res) => {
            const id = req.params.id;
            console.log(id);
 
            try {
                const notification = await Notification.findOne({ "notifications._id": id });
                console.log(notification);

                if (!notification) {
                console.log('no notification'); 
                return res.status(209).json({ error: "Notification not found" });
                }
                notification.notifications.pull({ _id: id });
                await notification.save();

                res.status(200).json({ message: "Notification deleted successfully" });
                console.log('deleted');

            } catch (error) {
                console.error(error); 
                res.status(500).json({ error: "Server error" });
            }
            };




    module.exports = {signup,login,hostRide,joinRide,loginWithGoogleAuth,signupWithGoogleAuth,rideDetails,
        hosterDetails,EditPersonalDetails,EditPassword,myRides,fetchChat,fetchPreviuosChatDetails,
        fetchChatForNotification,uploadImage,sendNotification,fetchNotification,deleteNotification};