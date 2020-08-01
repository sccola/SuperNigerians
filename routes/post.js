const express = require('express');

const router = express.Router();

const {
    userPost
} = require('../controllers/post')
const {
    postView,
    postSingleView,
    postSearchByTitle,
    postLike,
    postdisLike
} = require('../controllers/post');


router.get('/posts', postView);
router.get('/:slug', postSingleView)
router.post('/new', userPost);
router.get('/posts/search/:title', postSearchByTitle);
router.patch('/post/:slug/like', postLike)
router.patch('/post/:slug/dislike', postdisLike)

module.exports = router;