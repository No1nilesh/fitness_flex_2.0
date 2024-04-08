"use server";
import Survey from "@models/survey";
import Trainer from "@models/trainer";

export async function assignTrainerToMember(memberId) {
  try {
    let bestTrainer = null;
    let maxScore = -1;
    // member data
    const memberSurveyData = await Survey.findOne({ user: memberId });
    const memberFocusAreas = memberSurveyData.focusAreas;
    const memberAvailability = memberSurveyData.availability; // Fixed typo
    const trainers = await Trainer.find({ verified: true }); //check the trainer is verified by the admin
    for (const trainer of trainers) {
      // Use for...of loop to iterate over trainers
      let score = 0; // Initialize score for each trainer

      const trainerSpecialties = trainer.specialties;
      const trainerAvailability = trainer.availability;

      if (trainer.assigned_members.length >= 10) {
        continue;
      }

      // Calculate score based on matching focus areas
      for (const memberFocusArea of memberFocusAreas) {
        if (trainerSpecialties.includes(memberFocusArea)) {
          score++;
        }
      }

      // Calculate score based on matching availability
      for (const memberAvailableTime of memberAvailability) {
        if (trainerAvailability.includes(memberAvailableTime)) {
          score++;
        }
      }

      // Update best trainer if current trainer has higher score
      if (score > maxScore) {
        maxScore = score;
        bestTrainer = trainer;
      }
      console.log("score", score);
    }
    return JSON.stringify(bestTrainer);
  } catch (error) {
    console.error("Error occurred while assigning trainer to member:", error);
    return null;
  }
}
