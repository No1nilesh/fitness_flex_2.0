import mongoose, { Schema, model, models } from "mongoose";

const memberSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },

    subscriptionId: {
      type: String,
      default: "", // Set a default value
      index: true,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const Member = models.Member || model("Member", memberSchema);

export default Member;
