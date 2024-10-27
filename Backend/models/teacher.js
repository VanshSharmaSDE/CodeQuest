const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const teacherSchema = new mongoose.Schema({
    teacherName: {
        type: String,
        required: true
    },
    teacherEmail: {
        type: String,
        required: true,
        unique: true
    },
    teacherPassword: {
        type: String,
        required: true
    },
    teacherImage:{
        type: String,
    },
    role: {
        type: String,
        required: true,
    },
    loginTime: {
        type: [Date], // This will store multiple login timestamps
        default: [],  // Default to an empty array
      },
});

teacherSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.teacherPassword = await bcrypt.hash(this.teacherPassword, 10);
    }
    next();
});

module.exports = mongoose.model("teacher",teacherSchema);