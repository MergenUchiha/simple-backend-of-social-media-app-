import express from "express";
import {
    addBlog,
    allBlogs,
    deleteBlog,
    getById,
    getByUserId,
    updateBlog,
} from "../controllers/blog.controller.js";
const blogRouter = express.Router();

blogRouter.get("/", allBlogs); //get all blogs (/blogs)
blogRouter.post("/add", addBlog); //add blog (/blogs/add)
blogRouter.put("/update/:id", updateBlog); //change blog (/blogs/{id of user})
blogRouter.get("/:id", getById); //get blog by ID (/blogs/{id of user})
blogRouter.delete("delete/:id", deleteBlog); //delete blog (/delete/{id of user})
blogRouter.get("/user/:id", getByUserId); //get user's blogs (/blogs/users/{id of user})

export default blogRouter;
