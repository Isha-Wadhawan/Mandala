import userModel from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

//Route for User LOGIN


const createToken = (id) => {

    return jwt.sign({ id }, process.env.JWT_SECRET)

}


const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;



        const user = await userModel.findOne({ email })

        if (!user)
            return res.json({ success: false, message: "User does not exist" })

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id.toString());
            const userData = {
                _id: user._id,
                name: user.name,
                email: user.email
            };
            res.json({ success: true, token, userData })

        }

        else {
            return res.json({ success: false, message: "Invalid credentials" })

        }
    }
    catch (err) {
        console.log(err)
    }


}


//Route for User REGISTRATION

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        //check if user already exists

        const exists = await userModel.findOne({ email })

        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // Validating Email format and Strong password

        if (!validator.isEmail(email))
            return res.json({ success: false, message: "Please enter a valid email" })

        if (password.length < 6)
            return res.json({ success: false, message: "Password length should be more than 6" })

        //Hashing user Passoword

        const salt = await bcrypt.genSalt(10);

        const hashPass = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashPass })

        const user = await newUser.save();

        const token = createToken(user._id.toString());
        res.json({
            success: true, token, userData: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    }
    catch (err) {

        console.log(err)
        return res.json({ success: false, message: err.message })


    }
}


//Route for User ADMIN LOGIN

const adminLogin = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token })

        }
        else {

            res.json({ success: false, message: "Invalid credentials" })
        }
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message })

    }

}


export { loginUser, registerUser, adminLogin }
