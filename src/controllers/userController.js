


const signupUser= async (req,res)=>{
    try{
        const {user} = req.body
        console.log(user.email);
    }catch(error){
        console.log(error);
    }
}

module.exports = {signupUser}