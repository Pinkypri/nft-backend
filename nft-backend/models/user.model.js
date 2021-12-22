const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String },
    // userType:{ type: String, required: true},
    lastName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    rePassword: { type: String},
    captcha:{type:Boolean, default: false },
    termsAndConditions:{type:Boolean, default: false },
    gender:{ type: String},
    dob:{ type: String},
 
    userId: { type: mongoose.Schema.Types.ObjectId},
    createdBy: { type: String },
    updatedBy: { type: String },
    editHistory: {type: JSON},
    created: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    isVerified: { type: Boolean , default: false },
    isActive: { type: Boolean , default: true },
    isDeleted: { type: Boolean , default: false }
}, { collection: 'users' });

module.exports = mongoose.model('userModel', userSchema);