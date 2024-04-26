import mongoose from "mongoose";
import Blog from "../models/blog.models.js";
import User from "../models/user.model.js";


//get all blogs
export const allBlogs = async (req, res, next) => {
    let blogs; //using for checking do blogs exist?  
    try {
        blogs = await Blog.find(); //try to find
    } catch (err) {
        return console.log(err);
    }
    //if no ,there is error(404) ,else return (200) and blogs
    if (!blogs) {
        return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({ blogs });
};


//add blog
export const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body; //what must be on request
    
    let existingUser; //using for checking does user exist?
    try {
        existingUser = await User.findById(user);
    } catch (err) {
        return console.log(err);
    }
    if(!existingUser) {
        return res.status(404).json({ message: "Unable to find User"});
    }
    //if no user,there is error(404) 
    const blog = new Blog({
        title,
        description,
        image,
        user,
    });
    //adding id of user to blog
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: err})
    }
    //return (200) and blog
    return res.status(200).json({ blog });
};


//change blog
export const updateBlog = async (req, res, next) => {
    const { title, description } = req.body;//that, what we change 
    const blogId = req.params.id;//getting id of blog from request
    let blog; //for checking is blog exist?
    try{
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        })
    }
    catch (err) {
        return console.log(err);
    }
    if(!blog) {
        return res.status(500).json({message:"Unable to Update"})
    }
    return res.status(200).json({blog})
};


//get blog by id
export const getById = async (req, res, next) => {
    const blogId = req.params.id;//getting id of blog from request
    let blog;//for checking is blog exist?
    try {
        blog = await Blog.findById(blogId);
    }
    catch(err) {
        return console.log(err);
    }
    if(!blog) {
        return res.status(404).json({message : "Not Found"});
    }
    return res.status(200).json({blog});
}

//delete blog
export const deleteBlog = async (req, res, next) => {
    const blogId = req.params.id;//getting id of blog from request
    let blog;//for checking is blog exist?
    try {
        blog = await Blog.findByIdAndDelete(blogId).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }
    catch(err) {
        return console.log(err);
    }
    if(!blog) {
        return res.status(404).json({message : "Unable to Delete"});
    }
    return res.status(200).json({message : "Success Deleted"});
}

//get user's blogs
export const getByUserId = async (req , res, next) => {
    const userId = req.params.id;//getting id of blog from request
    let userBlogs;//for checking is user exist and searching all user's blogs ?
    try {
        userBlogs = await User.findById(userId).populate("blogs");
    }
    catch(err) {
        return console.log(err);
    }
    //does the user have blogs: if yes - returns user's blogs;else retruns error(404)
    if(!userBlogs) {
        return res.status(404).json({message : "Blog Not Found"});
    }
    return res.status(200).json({blogs:userBlogs});
} 