const cloud = require('cloudinary').v2;

const User = require('../models/user')
const Post = require('../models/post')

const {
    renderPage
} = require('../utils/render-page');
const {
    populate
} = require('../models/post');

// cloudinary Configuration
cloud.config({
    cloud_name: process.env.SUPPER_NIGERIA_CLOUD_NAME,
    api_key: process.env.SUPPER_NIGERIA_CLOUD_API,
    api_secret: process.env.SUPPER_NIGERIA_CLOUD_SECRET,
});

module.exports = {
    // eslint-disable-next-line consistent-return
    userPost: async (req, res) => {
        const {
            title,
            body,
            description
        } = req.body;
        // look for the info for all the stuff
        const {
            _id
        } = req.session.user
        const userfilter = {
            _id
        }
        try {
            // find user
            const findUser = await User.findById(userfilter)
            if (!findUser) return res.send("user not found")
            // check if a particular post has been created by a user

            // eslint-disable-next-line no-use-before-define
            const postUrl = await uploadPhoto(req, res, 'image/png', 'image/jpeg', 500000000)
            const postCreate = await Post.create({
                title,
                body,
                description,
                postPicture: postUrl,
                creator: findUser
            })

            const postResponse = await postCreate.save()
            findUser.posts.push(postResponse)
            const updatePost = await findUser.save()

            if (!updatePost) res.status(400).send({
                status: 'error',
                message: 'Failed to post'
            })
            res.status(200).send({
                status: "success",
                message: "Post successfully saved"
            })
        } catch (err) {
            res.status(500).send({
                status: 'error',
                message: 'An error ocuured, makesure you filled all input field and avoid duplicate post'
            })
        }
    },
    postView: async (req, res) => {

        const posts = await Post.find({}).sort({
            date: 'desc'
        });
        
        const data = {
            posts,
            path: 'post'
        };
        renderPage(res, 'pages/posts', data, 'Posts', '/posts');
    },

    postSingleView: async (req, res) => {
        let slug = req.params.slug;
        const post = await Post.find({
            slug
        }).populate('comments').populate('creator')
        const data = {
            post,
            success: req.flash('success'),
            path: 'post'
        };
        renderPage(res, 'pages/post', data, 'Post', '/post');
    },

    postSearchByTitle: async (req, res) => {
        const {
            title
        } = req.query;
        const posts = await Post.find({
            $and: [{
                slug: {
                    $regex: title,
                    $options: 'i'
                },
            }, ]
        });
        const data = {
            posts,
            path: 'post'
        }
        renderPage(res, "pages/searchedPosts", data, "Searched Posts Results", '/posts/search');
    },

   /*  postLike: async (req, res) => {

    },

    postdisLike: async (req, res) => {

    } */
}

/**
 * @param {*} mediaType type of file to upload
 * verify the image 
 * upload the image to cloudinary
 */
const uploadPhoto = async (req, res, mediaType, sImage, size) => {
    if (!req.files) {
        return res.status(400).json({
            status: 'error',
            message: 'No files selected'
        })
    }
    const imageFile = req.files.photo;
    if (!(imageFile.mimetype === mediaType || imageFile.mimetype === sImage))
        return res.status(400).json({
            status: 'error',
            message: 'Invalid file format'
        })

    if (imageFile.size > size) {
        return res.status(400).json({
            status: 'error',
            message: 'Upload file equivalent or lower than file size specified'
        })
    }
    try {
        const userLogoUpload = await cloud.uploader.upload(imageFile.tempFilePath);
        const {
            url
        } = userLogoUpload;
        // console.log(url)
        return url;

    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        })

    }
}