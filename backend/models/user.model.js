//model for user
import mongoose from "mongoose";

const Schema = mongoose.Schema;

//template of user model
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6, 
    },
    blogs: [{type : mongoose.Types.ObjectId,ref:"Blog",required : true}]
});

export default mongoose.model("User",userSchema);