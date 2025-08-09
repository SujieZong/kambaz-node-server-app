import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true },
    course: { type: String, ref: "CourseModel", required: true },
    description: String,
    dueDate: String,
    availableFrom: String,
    availableUntil: String,
    points: { type: Number, default: 100 },
    assignmentGroup: String,
    displayGradeAs: {
      type: String,
      enum: ["POINTS", "PERCENTAGE", "LETTER", "GPA", "COMPLETE_INCOMPLETE"],
      default: "POINTS",
    },
    submissionType: {
      type: String,
      enum: ["ONLINE", "ON_PAPER", "EXTERNAL_TOOL", "NO_SUBMISSION"],
      default: "ONLINE",
    },
    onlineEntryOptions: [String],
    assignTo: String,
    status: {
      type: String,
      enum: ["PUBLISHED", "UNPUBLISHED"],
      default: "UNPUBLISHED",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "assignments" }
);

export default assignmentSchema;
