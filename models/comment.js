const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        comment: {
            type: String,
            required: true
        },
        like: {
            type: Number,
        },
        dislike: {
            type: Number,
        },
        commentReplies: [{
            type: Schema.Types.ObjectId,
            ref: 'CommentReplies'
        }],
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        name: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);