const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const {
  renderPage
} = require("../utils/render-page");
const sendMail = require("../utils/send-email");
const { use } = require("marked");


const getAllPosts = async () => {
  const allPosts = await Post.find().sort({
    date: 'desc'
  });
  return allPosts;
};

const getUnverifiedPosts = async () => {
  const verify = await Post.find({
    status: 'false'
  }).populate('creator').sort({
    date: 'desc'
  });
  return verify;
};

const filterData = async (data, key) => {
  let filteredData;
  if (key === 'false') {
    filteredData = data.filter((myData) => {
      return myData.status === key;
    });
  }
  if (key === 'true') {
    filteredData = data.filter((myData) => {
      return myData.status === key;
    });
  }
  if (key === 'admin') {
    filteredData = data.filter((myData) => {
      return myData.role === key;
    });
  }
  return filteredData;
};

module.exports = {
  dashboard: async (req, res) => {
    const allPosts = await getAllPosts();
    const totalUsers = await User.find();
    const totalUnverifiedPosts = await filterData(allPosts, 'false');
    const totalVerifiedPosts = await filterData(allPosts, 'true');
    const unverifiedPosts = await getUnverifiedPosts();
    const allAdmins = await filterData(totalUsers, 'admin')

    // console.log(unverifiedPosts);
    const data = {
      allPosts,
      totalUnverifiedPosts,
      totalVerifiedPosts,
      unverifiedPosts,
      totalUsers,
      allAdmins,
    };
    renderPage(res, 'pages/adminDashboard', data, 'Admin | Dashboard', '/admin/dashboard');
  },

  profile: async (req, res, next) => {
    try {
    const { _id } = req.session.user
    const user = await User.findOne({ _id });
    const userComments = await Comment.find({ creator: _id });
    const userPosts = await Post.find({ creator: _id });
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
    };
    renderPage(
      res,
      "pages/adminProfile",
      data,
      "Admin | Profile",
      "/admin/profile"
    );
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const {
        postId
      } = req.params;
      
      const userPost = await Post.findById({ _id: postId });
      if (!userPost) {
        req.flash("error", "Post does not exist");
      }

      Post.findByIdAndDelete(postId,(err) => {
        if(err) req.flash("error", "An error occured while deleting post");
        req.flash("Post deleted sucessfully");  
      });

      res.redirect('back');
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find();
      if (!users) return req.flash("error", "No User found !");

      const data = {
        users,
      };

      renderPage(res, "pages/adminUserList", data, "All Users", "/users");
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  },

  suspendUser: async (req, res, next) => {
    const {
      userId
    } = req.params;
    try {
      const users = await User.findByIdAndUpdate(userId,{
         active: 'false'
      });
      if (!users) return req.flash("error", "No User found !");

      return res.redirect('back')
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }


  },

  approvePost: async (req, res) => {
    try {
      const {
        postId
      } = req.params;
      const approvedPost = await Post.findByIdAndUpdate(postId, {
        $set: {
          status: "true",
        },
      });
      const postCreator = await User.findById(approvedPost.creator);

      if (!approvedPost) {
        req.flash("error", "An error occured while approving post");
      }

      if (approvedPost.status === "true") {
        req.flash("error", "Post has already been approved");
      }
      if (!postCreator) {
        req.flash("error", "Creator not found");
      }
      const message = `Your post with the title: <b>${approvedPost.title}</b> has been published live.`;
      sendMail({
        email: postCreator.email,
        subject: "Post Approval",
        message,
      });
      req.flash("Post Approved sucessfully");
      return res.redirect('back')
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  },

  disApprovePost: async (req, res) => {
    try {
      const {
        postId
      } = req.params;
      const approvedPost = await Post.findByIdAndUpdate(postId, {
        $set: {
          status: "false",
        },
      });

      if (!approvedPost) {
        req.flash("error", "An error occured while approving post");
      }

      if (approvedPost.status === "false") {
        req.flash("error", "Post has already been disapproved");
      }

      req.flash("Post Disapproved sucessfully");
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  },

  verified: async (req, res) => {
    try {
      const verifidPosts = await Post.find({
        status: 'true'
      }).populate('creator').sort({
        date: 'desc'
      });
      const unverifiedPosts = await Post.find({
        status: 'false'
      })
      const data = {
        verifidPosts,
        unverifiedPosts,
      }
      return renderPage(res, 'pages/adminDashboard', data, 'Admin | Dashboard', '/admin/dashboard/posts/verified');
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  },

  deleteComment: async (req, res, next) => {
    try {
      const { commentId, postId } = req.params;
      
      const userPost = await Post.findById({ _id: postId });
     
      const postComment = await userPost.comments.filter((comment) => {
        return String(comment) !== String(commentId);
      });

      userPost.comments = postComment;
      await userPost.save();
      
      Comment.findByIdAndRemove(commentId ,(err) => {
        if(err) req.flash("error", "An error occured while deleting comment");
        req.flash('success', "Comment deleted sucessfully");
        res.redirect('back');  
      });
    } catch(err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  }
};