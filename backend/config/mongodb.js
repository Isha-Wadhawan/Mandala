import mongoose from "mongoose";

const connectDB = async ()=>{

    mongoose.connection.on('connected', ()=>{
        console.log("Connetced DB");
    
    });
    await mongoose.connect(`${process.env.MONGODB_URI}mandala`);

}

export default connectDB;