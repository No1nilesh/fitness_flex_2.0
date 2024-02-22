import NextAuth from "next-auth/next";
import { connectToDb } from "@utils/conntectToDb";
import User from "@models/users";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "../lib/mongodb"

// Random Password generater to fill the empty options for Signin with Google ad Github Provider.
const generateRandomPassword=(length = 10)=> {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; ++i) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
  }
  const hashedpassword = bcrypt.hash(password, 10)
  return hashedpassword;
}


//login function to compare and return user
async function login(credentials){
try {
  await connectToDb();
  const user = await User.findOne({email : credentials.email});
  if(!user) throw new Error("Wrong Credentials.");
  const isCorrect = await bcrypt.compare(credentials.password, user.password);
  if(!isCorrect) throw new Error("Wrong Credentials.");
  return user;
} catch (error) {
  console.log("error while logging in");
  throw new Error("Something Went Wrong.");
}
}

export const authOptions = {  
  adapter: MongoDBAdapter(clientPromise),
  pages : {
    signIn : "/login"
  },
  providers : [
    //Credentail Provider
    CredentialsProvider({
      name : "credentials",
      credentials :{},
      async authorize(credentials){
        try {
         const user = await login(credentials);
         return user;
        } catch (error) {
          throw new Error("Failed to login.")
        }
      }
    }),

    // Google Provider
    GoogleProvider({
      clientId : process.env.GOOGLE_ID,
      clientSecret : process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile){
        return {
          id : profile.sub,
          name : profile.name,
          email : profile.email,
          image : profile.picture,
          role : profile.role ?? 'user'
        }
      }
    }),
    // Github Provider
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile){
        return {
          ...profile,
          role : profile.role ?? "user"
        }
      }
    }),
    
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  callbacks : {

    async jwt({token , user}){
      if(user){
        console.log(user.role)
        token.name = user.name,
        token.email = user.email,
        token.id = user.id
        token.role = user.role
      }
      console.log("this is token", token)
      return token
    },

    async session({session , token}){
      if(token){
        session.name = token.name,
        session.email = token.email,
        session.id = token.id
        session.user.role = token.role
      }
    
    console.log("this is session", session)
      return session;
    },


    async signIn({user, account }){
      // checking for credential provider
     if(account?.provider == "credentials"){
      return true
     }

     //checking for OAuth provider
     if(account?.provider == "google" || account?.provider == "github"){
      try {
        connectToDb();
        console.log("connected to db successfully");
        const userExists = await User.findOne({email : user.email}).then(console.log("check comlepeted"));
        if(!userExists){
          await User.create({
            email : user.email,
            name : user.name,
            image : user.picture,
            password : await generateRandomPassword()
          })
        }
        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
     }
     
    }
  }
}

const handler = NextAuth(authOptions);

export {handler as GET , handler as POST}