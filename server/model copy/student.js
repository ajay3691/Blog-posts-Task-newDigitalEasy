// models/student.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  age: { type: Number, default: 0 },
  class: { type: String, required: true }, // Add a class field
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
