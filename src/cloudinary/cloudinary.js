

const cloudinary = require('cloudinary');

cloudinary.config({

    cloud_name : 'dzhfutnjh',
    api_key : '987579139499276',
    api_secret : 'AEz_IRzY8XpMaXoayP3xBaf2L2w'
})

exports.uploads = (file,folder)=>{
    return new Promise(resolve =>{
        cloudinary.uploader.upload(file,(result)=>{
            // console.log('cloudinary result', result)
            resolve({
                url:result.url,
            })
        },{
            resource_type:'auto',
            folder:folder
        })
    })
}