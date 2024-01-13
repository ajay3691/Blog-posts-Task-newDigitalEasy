// models/mark.js
import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  student: { type: Number, ref: 'Student', required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
});

const Mark = mongoose.model('Mark', markSchema);

export default Mark;
