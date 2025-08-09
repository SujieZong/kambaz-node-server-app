import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export const createAssignment = (assignment) => {
  const newAssignment = {
    ...assignment,
    _id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return model.create(newAssignment);
};

export const findAllAssignments = () => model.find();

export const findAssignmentById = (assignmentId) =>
  model.findById(assignmentId);

export const findAssignmentsForCourse = (courseId) =>
  model.find({ course: courseId });

export const updateAssignment = (assignmentId, assignmentUpdates) => {
  const updates = { ...assignmentUpdates, updatedAt: new Date() };
  return model.updateOne({ _id: assignmentId }, { $set: updates });
};

export const deleteAssignment = (assignmentId) => {
  return model.deleteOne({ _id: assignmentId });
};
