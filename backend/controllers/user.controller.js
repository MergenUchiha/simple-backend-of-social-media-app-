import User from "../models/user.model.js";
import Blog from "../models/blog.models.js";
import bcrypt from "bcryptjs";

//get all users
export const allUsers = async (req, res, next) => {
    let users; //is user exist?
    try {
        users = await User.find();
    } catch (err) {
        return console.log(err);
    }
    if (!users) {
        return res.status(404).json({ message: "No users" });
    }
    return res.status(200).json({ users });
};

//sing up user
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body; //what must be in request
    let existingUser; //is user exist?
    try {
        existingUser = await User.findOne({ email }); //filtered by unique email
    } catch (err) {
        return console.log(err);
    }
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password); //encrypt the password

    //template for user creating
    const user = new User({
        username,
        email,
        password: hashedPassword,
        blogs: [],
    });
    try {
        await user.save();
    } catch (err) {
        return console.log(err);
    }
    //if user created returns user's data
    return res.status(201).json({ user });
};

//log in user
export const login = async (req, res, next) => {
    const { username, email, password } = req.body; //what must be in request
    let existingUser; //is user exist?
    try {
        existingUser = await User.findOne({ email }); //filtered by unique email
    } catch (err) {
        return console.log(err);
    }

    if (!existingUser) {
        return res
            .status(404)
            .json({ message: "There is no user with same email" });
    }
    //decrypt and compare the password
    const isPasswordCorrect = bcrypt.compareSync(
        password,
        existingUser.password
    );
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid password" });
    }
    return res.status(200).json({ message: "Login successful" });
};

//delete user by id without password(for admin)
export const userDelete = async (req, res, next) => {
    const userId = await req.params.id; //user id from request
    let userBlogs;
    try {
        userBlogs = await Blog.find({ user: userId }); //get all blogs of user by userId
    } catch (err) {
        return console.log(err);
    }
    //firstfull delete all blogs then delete the user 
    await Promise.all(
        userBlogs.map((blog) => Blog.findByIdAndDelete(blog.id))
    ).then(await User.findByIdAndDelete(userId));
    return res.status(200).json({ message: "User deleted successfully" });
};
