import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  // Check if already enrolled
  const existingEnrollment = enrollments.find(
    (enrollment) => enrollment.user === userId && enrollment.course === courseId
  );
  if (existingEnrollment) {
    return existingEnrollment;
  }
  const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
  enrollments.push(newEnrollment);
  return newEnrollment;
}

export function unenrollUserFromCourse(userId, courseId) {
  const { enrollments } = Database;
  const index = enrollments.findIndex(
    (enrollment) => enrollment.user === userId && enrollment.course === courseId
  );
  if (index > -1) {
    return enrollments.splice(index, 1)[0];
  }
  return null;
}

export function findEnrollmentsForUser(userId) {
  const { enrollments } = Database;
  return enrollments.filter((enrollment) => enrollment.user === userId);
}

export function findEnrollmentsForCourse(courseId) {
  const { enrollments } = Database;
  return enrollments.filter((enrollment) => enrollment.course === courseId);
}

export function findAllEnrollments() {
  const { enrollments } = Database;
  return enrollments;
}

export function findEnrollmentByUserAndCourse(userId, courseId) {
  const { enrollments } = Database;
  return enrollments.find(
    (enrollment) => enrollment.user === userId && enrollment.course === courseId
  );
}
