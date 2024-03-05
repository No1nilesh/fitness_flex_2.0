import NextAuth from "next-auth/next";
import { connectToDb } from "@utils/conntectToDb";
import User from "@models/users";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "../lib/mongodb"
import Stripe from "stripe";

// Random Password generater to fill the empty options for Signin with Google ad Github Provider.
const generateRandomPassword=async(length = 10)=> {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; ++i) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
  }
  const hashedpassword = await bcrypt.hash(password, 10)
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
  adapter: MongoDBAdapter(clientPromise, {databaseName : 'fitness_flex'}),
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
          password : await generateRandomPassword(),
          role : profile.role ?? 'user',
          stripeCustomerId : profile.stripeCustomerId ?? '',
          subscriptionId : profile.subscriptionId ?? '',
          isActiveMember : profile.isActiveMember ?? false
        }
      }
    }),
    // Github Provider
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile){
        return {
          id : profile.id,
          name : profile.name,
          email : profile.email,
          image : profile.picture,
          stripeCustomerId : profile.stripeCustomerId ?? '',
          subscriptionId : profile.subscriptionId ?? '',
          role : profile.role ?? 'user',
          isActiveMember : profile.isActiveMember ?? false
        }
      }
    }),
    
  ],
  
  secret: process.env.NEXTAUTH_SECRET,

  events : {
    createUser : async({user})=>{
      const stripe = new Stripe(process.env.STRIPE_SECRET);
      const customer = await stripe.customers.create({
        name : user.name,
        email : user.email
      })

      const updateUser = {
        id : user.id,
        stripeCustomerId : customer.id
      }
      const updatedUserData = await authOptions.adapter.updateUser(updateUser)
      console.log("updateduser", updatedUserData);
    }
  },
  session: {
    strategy: "jwt",
  },

  callbacks : {

    async jwt({token , user, trigger}){
      if(user){
        token.id = user.id,
        token.name = user.name,
        token.email = user.email,
        token.role = user.role,
        token.stripeCustomerId = user.stripeCustomerId,
        token.subscriptionId = user.subscriptionId,
        token.isActiveMember = user.isActiveMember
      }

      // to update changes in jwt token when some thing change in database. 
        if (trigger === 'update') {
          const refreshedUser = await authOptions.adapter.getUser(token.id);
          console.log(refreshedUser);
          token.id = refreshedUser.id,
          token.name = refreshedUser.name,
          token.email = refreshedUser.email,
          token.role = refreshedUser.role,
          token.stripeCustomerId = refreshedUser.stripeCustomerId,
          token.subscriptionId = refreshedUser.subscriptionId,
          token.isActiveMember = refreshedUser.isActiveMember
      }
  
      return token
    },

    async session({session , token}){
      if(token){
        session.name = token.name,
        session.email = token.email,
        session.id = token.id,
        session.user.id = token.id,
        session.user.role = token.role,
        session.user.stripeCustomerId = token.stripeCustomerId,
        session.user.subscriptionId = token.subscriptionId,
        session.user.isActiveMember = token.isActiveMember
      }
    
    console.log("this is session", session)
      return session;
    },
    // async session({session, user}){
      
    //     session.name = user.name,
    //     session.email = user.email,
    //     session.id = user.id,
    //     session.role = user.role,
    //     session.stripeCustomerId = user.stripeCustomerId,
    //     session.subscriptionId = user.subscriptionId,
    //     session.isActiveMember = user.isActiveMember
  
    
    // console.log("this is session", session)
    //   return session;
    // },


    async signIn({user, account }){
      // checking for credential provider
     if(account?.provider == "credentials"){
      return true
     }

     if(account?.provider == "google" || account?.provider == "github"){
      return true;
     }     
    }
  }
}

const handler = NextAuth(authOptions);

export {handler as GET , handler as POST}