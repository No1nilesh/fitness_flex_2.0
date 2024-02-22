import User from "@models/users";
import { connectToDb } from "@utils/conntectToDb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req){

    try {
        await connectToDb();
        const {name , email, password} = await req.json();
        console.log({name : name , email : email , password : password})
        const exists  = await User.findOne({email});
        if(exists){
            return NextResponse.json({message : "User with this Email already Exists"},{status : 500})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({name, email, password: hashedPassword});
        return  NextResponse.json({message: "User Created successfully"},{status: 201});
    } catch (error) {
        console.log(error)
        return  NextResponse.json({message : "Error Occured While Registering",  },{status:500})
    }

}