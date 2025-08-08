import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {
  // Enroll a user in a course
  app.post("/api/users/:userId/enrollments/:courseId", async (req, res) => {
    const { userId, courseId } = req.params;
    const enrollment = await enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  });

  // Unenroll a user from a course
  app.delete("/api/users/:userId/enrollments/:courseId", async (req, res) => {
    const { userId, courseId } = req.params;
    const status = await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
    if (status) {
      res.json({ message: "Successfully unenrolled" });
    } else {
      res.status(404).json({ message: "Enrollment not found" });
    }
  });

  // Get all enrollments for a user
  app.get("/api/users/:userId/enrollments", async (req, res) => {
    const { userId } = req.params;
    const enrollments = await enrollmentsDao.findCoursesForUser(userId);
    res.json(enrollments);
  });

  // Get all enrollments for a course
  app.get("/api/courses/:courseId/enrollments", async (req, res) => {
    const { courseId } = req.params;
    const enrollments = await enrollmentsDao.findUsersForCourse(courseId);
    res.json(enrollments);
  });

  // Get all enrollments
  app.get("/api/enrollments", async (req, res) => {
    const enrollments = await enrollmentsDao.findAllEnrollments();
    res.json(enrollments);
  });

  // Check if a user is enrolled in a course
  app.get("/api/users/:userId/enrollments/:courseId", async (req, res) => {
    const { userId, courseId } = req.params;
    const enrollment = await enrollmentsDao.findEnrollmentByUserAndCourse(
      userId,
      courseId
    );
    if (enrollment) {
      res.json(enrollment);
    } else {
      res.status(404).json({ message: "Enrollment not found" });
    }
  });
}
