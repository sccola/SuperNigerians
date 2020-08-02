const cloud = require('cloudinary').v2;
const User = require('../models/user')

// cloudinary Configuration
cloud.config({
  cloud_name: process.env.SUPPER_NIGERIA_CLOUD_NAME,
  api_key: process.env.SUPPER_NIGERIA_CLOUD_API,
  api_secret: process.env.SUPPER_NIGERIA_CLOUD_SECRET,
});

module.exports = {
  // eslint-disable-next-line consistent-return
  updateUser: async (req, res) =>{
    const { 
    firstname,
    lastname,
    location,
    phone } = req.body;
    // look for the info for all the stuff
    const {_id} = req.session.user
    const userfilter = { _id}
    const updateUser = { 
      firstname,
      lastname,
      location,
      phone }
    try {
        // find user and update
        const findUserUpdate = await User.findByIdAndUpdate(userfilter,updateUser)
        if(!findUserUpdate)return res.status(401).json("unable to update user profile")
        res.status(200).json({
          status:'success',
          message:"Successfully updated"})
      } catch(err) {
        res.status(400).json({
          status:'error',
          message:"An error occured"})
  }
},

userPhoto: async (req, res) =>{
  const {_id} = req.session.user
  // eslint-disable-next-line no-use-before-define
  const photo = await uploadPhoto(req, res,'image/png','image/jpeg',100000)
  await User.findByIdAndUpdate({_id},{photo})
}

}
/**
 * @param {*} mediaType type of file to upload
 * verify the image 
 * upload the image to cloudinary
 */

// eslint-disable-next-line consistent-return
const uploadPhoto = async (req, res, mediaType, sImage, size, next) => {
  if (!req.files) {
    return res.status(400).json({
      status:'error',
      message:'No files selected'
    })
   }
  const imageFile = req.files.photo;
  if (!(imageFile.mimetype === mediaType || imageFile.mimetype === sImage))
 return  res.status(400).json({
     status:'error',
     message:'Invalid file format'
   })

  if (imageFile.size > size) {
    return res.status(400).json({
      status:'error',
      message:'Upload file equivalent or lower than file size specified'
    })
  }
  try {
    const employerLogoUpload = await cloud.uploader.upload(imageFile.tempFilePath);
    const { url } = employerLogoUpload;
   // console.log(url)
    return url;
  
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}