const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentRepliesSchema = new Schema(
    {
        comment: {
            type: String,
            required: true
        },
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

module.exports = mongoose.model('CommentReplies', commentRepliesSchema);