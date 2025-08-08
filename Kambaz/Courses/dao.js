import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import enrollmentModel from "../Enrollments/model.js";

export function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}
export function findAllCourses() {
  return model.find();
}
export async function findCoursesForEnrolledUser(userId) {
  console.log("Looking for enrollments for user:", userId);
  const enrollments = await enrollmentModel.find({ user: userId });
  console.log("Found enrollments:", enrollments);

  const populatedEnrollments = await enrollmentModel
    .find({ user: userId })
    .populate("course");
  console.log("Populated enrollments:", populatedEnrollments);

  const courses = populatedEnrollments
    .map((enrollment) => enrollment.course)
    .filter((course) => course !== null && course !== undefined);

  console.log("Final courses:", courses);
  return courses;
}
export function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
}
export function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}
