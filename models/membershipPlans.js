import mongoose, { Schema } from "mongoose";
import { models, model } from "mongoose";

const membershipPlanSchema = new Schema({
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    stripeProductId : {
        type : String,
        required : true
    },
    planId : {
        type : String,
        required : true
    },
    name: {
        type: String,
        required: [true, "must provide a name"]
    },
    description: {
        type: String,
        required: [true, "must provide description"]
    },
    price: {
        type: Number,
        required: [true, "must provide price"]
    },
    durationUnit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years'], // Adjust units as needed
        required: [true, "must provide duration unit"]
    },
    features: {
        type: [String],
        required: [true, "must provide features"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});





const MembershipPlan = models.MembershipPlan || model("MembershipPlan", membershipPlanSchema);

export default MembershipPlan;