import mongoose, { Schema, model, models } from "mongoose";

const scheduleSchema = new Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  task_done: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Schedule = models.Schedule || model("Schedule", scheduleSchema);

export default Schedule;
