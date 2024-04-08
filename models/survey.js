import mongoose, { Schema, model, models } from "mongoose";

const surveySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming your user model is named 'User'
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    fitnessLevel: {
      type: String,
      required: true,
    },
    focusAreas: {
      type: [String], // Assuming an array of strings for focus areas
      default: [],
    },
    workoutFrequency: {
      type: String,
      required: true,
    },
    availability: {
      type: [String], // Assuming an array of strings for availability
      default: [],
    },
  },
  { timestamps: true }
);

const Survey = models.Survey || model("Survey", surveySchema);

export default Survey;
