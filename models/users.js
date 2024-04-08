import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Must provide a name"],
    },
    email: {
      type: String,
      required: [true, "Email must be Required."],
      unique: [true, "Email must be unique"],
    },

    password: {
      type: String,
      required: [true, "Password must be required"],
    },

    role: {
      type: String,
      enum: ["user", "trainer", "admin"],
      default: "user",
    },

    stripeCustomerId: {
      type: String,
      default: "", // Set a default value
      index: true,
      sparse: true,
    },

    isActiveMember: {
      type: Boolean,
      default: false,
    },
    isNewUser: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema);

export default User;
