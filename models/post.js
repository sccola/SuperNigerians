const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)
// const slug = require('mongoose-slug-generator');
// mongoose.plugin(slug);


const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
          },
        body: {
            type: String,
            required: true
          },
        description: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        sanitizedHtml: {
            type: String,
            required: true
          },
        postPicture: {
            type: String,
            required: false
        },
        status: {
            type: String,
            enum : ['true', 'false'], 
            default: 'false'
        },
        media: { type : Array , "default" : [] },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        comments: [
            {
              type: Schema.Types.ObjectId,
              ref: 'Comment'
            }
          ],
    },
    { timestamps: true }
);
postSchema.pre('validate', function(next) {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true })
    }
    if (this.body) {
      this.sanitizedHtml = dompurify.sanitize(marked(this.body))
    }
    next()
  })
  



module.exports = mongoose.model('Post', postSchema);