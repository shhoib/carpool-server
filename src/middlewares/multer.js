const multer = require('multer');
const path = require('path')

const imageStorage = multer.diskStorage({
    destination:(req,file,callback)=>{
        console.log('multer')
        callback(null,'src/uploads')
    },
    filename:(req,file,callback)=>{
        const ext = path.extname(file.originalname)
        callback(null,Date.now()+ext);
    }
})

const uploadImage = multer({storage: imageStorage}).single('profilePic')

module.exports = uploadImage