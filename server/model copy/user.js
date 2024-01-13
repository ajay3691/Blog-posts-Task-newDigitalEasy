import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    email: String,
    password: String,
    confirmPassword: String,
    role: { type: String, enum: ['admin', 'teacher'], default: 'teacher' }
});

let User = mongoose.model("userReg", userSchema);
export default User;
