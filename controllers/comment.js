const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const CommentReplies = require('../models/comment-replies');

const postExist = async (postId) => {
    const post = await Post.findById({ _id: postId });
    return post;
}

const anonymousUser = async () => {
    const user = await User.find({ email: "anonymous@exammple.com" });
    return user;
}

const commentExist = async (commentId) => {
    const comment = await Comment.findById({ commentId });
    return comment;
}

const createCommentReplies = async (userId, body, name) => {
    const comment = await CommentReplies.create({
        comment: body,
        creator: userId,
        name: name
    });
    return comment;
}

const createComment = async (userId, body, name) => {
    const comment = await Comment.create({
        comment: body,
        dislike: 0,
        like: 0,
        creator: userId,
        name: name
    });
    return comment;
}
module.exports = {
    addComment: async (req, res) => {
        try{
          //find campground
            const { postId } = req.params;
            const { body } = req.body;
            const user = req.session.user
            const post = await postExist(postId);
            if(!post) {
                return res.status(400).json({
                    message: "Post not found"
                });
            }
            let comment;
            if(!user) {
                const anonymous = await anonymousUser();
                comment = await createComment(anonymous[0]._id, body, anonymous[0].firstname);
            } else {
                comment = await createComment(user._id, body, `${user.firstname} ${user.lastname}`);
            }
            post.comments.push(comment);
            await post.save();
            
            res.redirect('back');
        } catch (err) {
            console.log(err);
            res.status(500).json({err})
        }
    },

    likeComment: async (req, res) => {
        try{
            const { commentId } = req.params;
            const comment = await commentExist(commentId);
            comment.like += 1
            await comment.save();
            return res.status(400).json({
                message: "Liked comment"
            })
        } catch (err) {
            res.stats(400).json({err})
        }
    },

    dislikeComment: async (req, res) => {
        try{
            const { commentId } = req.params;
            const comment = await commentExist(commentId);
            comment.dislike += 1
            await comment.save();
            return res.status(400).json({
                message: "Dislked comment"
            })
        } catch (err) {
            res.stats(400).json({err});
        }
    },

    addCommentReplies: async (req, res) => {
        try{
          //find campground
            const { commentId } = req.params;
            const { body } = req.body;
            const user = req.session.user
            const comment = await commentExist(commentId);
            if(!comment) {
                return res.status(400).json({
                    message: "Post not found"
                });
            }
            let commentReplies;
            if(!user) {
                const anonymous = await anonymousUser();
                commentReplies = await createcommentReplies(anonymous[0]._id, body, anonymous[0].firstname);
            } else {
                commentReplies = await createcommentReplies(user._id, body, `${user.firstname} ${user.lastname}`);
            }
            comment.commentReplies.push(comment);
            await comment.save();
            
            res.redirect('back');
        } catch (err) {
            console.log(err);
            res.status(500).json({err});
        }
    },
}