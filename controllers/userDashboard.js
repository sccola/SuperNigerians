const User = require("../models/user");
const { renderPage } = require("../utils/render-page");
const Comment = require("../models/comment");
const Post = require("../models/post");

exports.getUserDetails = async (req, res) => {
    if (!req.session.user) {
        res.redirect("/login");
    }
    const user = await User.findOne({ _id: req.session.user._id });
    if (user.role !== "user" || user.role !== "admin") {
        res.redirect("/");
    }
    const userComments = await Comment.find({ creator: user._id });
    const userPosts = await Post.find({ creator: user._id });
    const likes = [];
    let numberOfLikes = 0;
    userComments.forEach((comment) => {
        likes.push(comment.like);
    });
    if (likes.length !== 0) {
        numberOfLikes = likes.reduce((a, b) => {
            return a + b;
        });
    }
    const data = {
        user,
        userComments,
        userPosts,
        numberOfLikes,
        path: 'profile'
    };
    renderPage(res, "pages/userDashboard", data, "User Dashboard");
};
