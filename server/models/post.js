// post.model.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: String,
  isPrivate: {
    type: Boolean,
    default: false,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  
});


const Post = model('Post', postSchema);

export default Post;
