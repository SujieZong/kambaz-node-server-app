import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

let { assignments } = db;

export const createAssignment = (assignment) => {
  const newAssignment = { ...assignment, _id: uuidv4() };
  assignments.push(newAssignment);
  return newAssignment;
};

export const findAllAssignments = () => assignments;

export const findAssignmentById = (assignmentId) =>
  assignments.find((assignment) => assignment._id === assignmentId);

export const findAssignmentsForCourse = (courseId) =>
  assignments.filter((assignment) => assignment.course === courseId);

export const updateAssignment = (assignmentId, assignmentUpdates) => {
  assignments = assignments.map((assignment) =>
    assignment._id === assignmentId
      ? { ...assignment, ...assignmentUpdates }
      : assignment
  );
  return assignments.find((assignment) => assignment._id === assignmentId);
};

export const deleteAssignment = (assignmentId) => {
  const index = assignments.findIndex(
    (assignment) => assignment._id === assignmentId
  );
  if (index !== -1) {
    assignments.splice(index, 1);
    return { status: "ok" };
  }
  return { status: "error" };
};
