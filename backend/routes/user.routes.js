import express from 'express';
import { allUsers, login, signup, userDelete } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/",allUsers); //get all users (/user)
router.post("/signup",signup); //signup (user/signup)
router.post("/login",login); //login (user/login)
router.delete("/delete/:id",userDelete); //delete user with blogs (user/delete/{id of user})
export default router;