import mongoose, { Schema, model, models } from "mongoose";

const trainerSchema = new Schema({
  verified: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
  },
  assigned_members: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    max: 10,
  },
  specialties: [{ type: String, required: true }],
  experience: {
    type: Number,
    required: true,
  },
  hourlyRate: {
    type: Number,
  },
  availability: [
    {
      type: String,
      required: true,
    },
  ],
  rating: { type: Number, default: 0 },
});

const Trainer = models.Trainer || model("Trainer", trainerSchema);

export default Trainer;
