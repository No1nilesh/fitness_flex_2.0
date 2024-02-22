import mongoose, { connect } from "mongoose";
let isConnected = false;

export async function connectToDb(){

    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
      }

try {
   await mongoose.connect(process.env.MONGODB_URI, {
    dbName : "fitness_flex"
   });
   isConnected = true;
   console.log("connected to mongodb successfully")
   isConnected = true
} catch (error) {
    console.log("error while connecting to mongodb", error)
}
}