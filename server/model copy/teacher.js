// models/teacher.js
import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  id: { type: Number},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // New email field
  subjects: [{ type: String }], // Array of subjects associated with the teacher
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
