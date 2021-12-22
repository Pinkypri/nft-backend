const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    Profilepicture: { type: String },
    // ProfileType:{ type: String, required: true},
    Coverpicture: { type: String },
    user_id: { type: String, unique: true },
    username: { type: String },
    created_on:{type:Date,default: Date.now},
    ProfileId: { type: mongoose.Schema.Types.ObjectId},
    createdBy: { type: String },
    updatedBy: { type: String },
    editHistory: {type: JSON},
    created: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    isVerified: { type: Boolean , default: false },
    isActive: { type: Boolean , default: true },
    isDeleted: { type: Boolean , default: false }
}, { collection: 'Profiles' });

module.exports = mongoose.model('ProfileModel', ProfileSchema);