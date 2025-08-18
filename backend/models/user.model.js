import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String,required: true,unique: true,trim: true,lowercase: true},
    password: {type: String,required: true},
    name: {type: String,required: true,trim: true},
    role: {type: String,default: "user",enum: ["user","admin"]},
    status: {type: String,enum: ["active", "banned", "suspended"], default: "active"},
    flaggedCommentsCount: { type: Number,default: 0},
    profilePicUrl: {type: String,default: ""}
}, {timestamps:true});

export default mongoose.model("User", userSchema);
