const Post = require("../models/post");
const User = require("../models/user");
const { renderPage } = require("../utils/render-page");
const sendMail = require("../utils/send-email");


const getAllPosts = async () => {
  const allPosts = await Post.find().sort({date: 'desc'});
  console.log(allPosts);
  return allPosts;
};

const getVerifiedPosts = async () => {
  const verify = await Post.find({ status: 'false'}).populate('creator').sort({date: 'desc'});
  return verify;
};

const filterData = async (data, key) => {
  let filteredData;
  if(key === 'false') { filteredData = data.filter( (myData) => {
      return myData.status === key;
    });
  }
  if(key === 'true'){ filteredData = data.filter( (myData) => {
      return myData.status === key;
    });
  }
  if(key === 'admin'){ filteredData = data.filter( (myData) => {
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
    const unverifiedPosts = await getVerifiedPosts();
    const allAdmins = await filterData(totalUsers, 'admin')

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

  profile: async (req, res) => {
    const data = {};
    renderPage(
      res,
      "pages/adminProfile",
      data,
      "Admin | Profile",
      "/admin/profile"
    );
  },

  deletePost: async (req, res, next) => {
    try {
      const { postId } = req.params;

      const userPost = await Post.findById({ _id: postId });
      if (!userPost) {
        req.flash("error", "Post does not exist");
      }

      Post.findByIdAndDelete(postId,(err) => {
        if(err) req.flash("error", "An error occured while deleting post");
        console.log("Successful deletion");
      });

      req.flash("Post deleted sucessfully");
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

  deleteUser: async (req, res) => {
    const { userId } = req.params;
    try {
      const users = await User.findOneAndDelete({ _id: userId });
      if (!users) return req.flash("error", "No User found !");


    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }


  },

  approvePost: async (req, res) => {
    try {
      const { postId } = req.params;
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
      const { postId } = req.params;
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
};
