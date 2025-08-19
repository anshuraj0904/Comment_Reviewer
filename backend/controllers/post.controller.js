import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js"
import mongoose from "mongoose";


export const createPost = async (req, res) => {
  const userId = req.user.id;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Please pass title and content" });
  }

  if (title.trim() === "" || content.trim() === "") {
    return res
      .status(400)
      .json({ message: "You cannot pass empty title or content!" });
  }

  try {
    const newPost = await Post.create({
      title:title.trim(),
      postContent: content.trim(),
      createdBy: userId,
    });

    return res
      .status(201)
      .json({ message: "New Post created!", post: newPost });
  } catch (e) {
    console.error("Error creating the post!", e);
    return res.status(500).json({ message: "Error in creating the post!" });
  }
};

export const editPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { newTitle, newContent } = req.body;  
  const updatedData = {}

  if(newTitle && newTitle.trim() !== "")
  {
    updatedData.title = newTitle.trim()
  }

  if(newContent && newContent.trim() !== "")
  {
    updatedData.postContent = newContent.trim()
  }

  if(Object.keys(updatedData).length === 0)
  {
      return res.status(400).json({ message: "Pass either title or content to be updated!"});
  }

  try {
    const updatedPost = await Post.findOneAndUpdate(
        {_id:postId, createdBy:userId},
        {$set: updatedData},
        {new: true}
    )
    if(!updatedPost)
    {
        return res.status(404).json({message:"Post not found to be updated!"})
    }

    return res.status(200).json({ message: "Post updated successfully!", data: updatedPost })
  } 
  catch (e) {
    console.error("Error updating the post: ", e)
    return res.status(500).json({message:"Some error occurred while updating the post!"})
  }
};


export const deletePost = async(req,res)=>{
    
    const userId = req.user.id
    const postId = req.params.id
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction()
        const deletedPost = await Post.findOneAndDelete({_id:postId, createdBy:userId}, {session})

        if(!deletedPost)
        {
            await session.abortTransaction()
            return res.status(404).json({message:"Post not found to be deleted!"})
        }

        await Comment.deleteMany({commentedOn:postId}, {session})
        await session.commitTransaction()
        return res.status(200).json({message:"Post and its comments deleted successfully!", data: deletedPost._id})



    } catch (e) {
        console.error("Error occured while deleteing the post: ", e)
        await session.abortTransaction()
        return res.status(500).json({message:"Error while deleting the post!"})
    }

    finally{
        session.endSession()
    }
}


export const getMyPosts = async(req,res)=>{
  const userId = req.user.id
  try {
    const myPosts = await Post.find({createdBy:userId})
                              .select("title postContent createdAt")
                              .sort({createdAt:-1})

    if(myPosts.length == 0)
    {
          return res.status(200).json({message:"Data fetched Successfully!", data:[]})
    }

    return res.status(200).json({message:"Data fetched Successfully!", data:myPosts})
  } catch (e) {
     console.error("Error fetching the data: ", e)
     return res.status(500).json({message:"Error fetching the data"}) 
  }
}