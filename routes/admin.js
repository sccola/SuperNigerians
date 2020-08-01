const router = require('express').Router();
const { authorizeAdmin } = require('../middleware/auth')

const {
    dashboard, 
    deletePost,
    getAllUsers,
    approvePost,
    disApprovePost,
    profile,
    verified,
    suspendUser,
    deleteComment,
} = require('../controllers/admin');


router.get('/dashboard', authorizeAdmin, dashboard);
router.get('/dashboard/posts/verified', authorizeAdmin, verified);
router.get('/dashboard/profile',authorizeAdmin, profile )
router.get('/dashboard/users', getAllUsers);
router.patch('/suspend/:userId', authorizeAdmin, suspendUser);
router.delete('/delete/:postId', authorizeAdmin, deletePost);
router.put('/posts/:postId/approve', authorizeAdmin, approvePost);
router.put('/posts/:postId/disapprove', authorizeAdmin, disApprovePost);
router.get('/comment/:commentId/delete', authorizeAdmin, deleteComment);


module.exports = router;