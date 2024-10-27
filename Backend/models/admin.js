const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const  adminSchema = mongoose.Schema({
    adminName: {
        type: String,
        required: true, 
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true
    },
    adminPassword: {
        type: String,
        required: true
    },
    role:{
        type: String,
        require:true
    },
    loginTime: {
        type: [Date], // This will store multiple login timestamps
        default: [],  // Default to an empty array
      },
   
});

adminSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.adminPassword = await bcrypt.hash(this.adminPassword, 10);
    }
    next();
});

module.exports = mongoose.model("admin",adminSchema);