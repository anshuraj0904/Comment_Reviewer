import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    title:{type:String, maxlength:150},
    postcontent:{type:String, minlength:250},
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

},{timestamps:true})

export default mongoose.model("Post", postSchema)