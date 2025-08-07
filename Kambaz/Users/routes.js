import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
export default function UserRoutes(app) {
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  const createUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (
      !currentUser ||
      currentUser.role !== "FACULTY" ||
      currentUser.role !== "ADMIN"
    ) {
      res
        .status(403)
        .json({ message: "Only faculty or admin can create users" });
      return;
    }
    const newUser = await dao.createUser(req.body);
    res.json(newUser);
  };

  const deleteUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (
      !currentUser ||
      currentUser.role !== "FACULTY" ||
      currentUser.role !== "ADMIN"
    ) {
      res
        .status(403)
        .json({ message: "Only faculty or admin can delete users" });
      return;
    }
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json(currentUser);
  };
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };
  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  // Get all users enrolled in a specific course (for People screen)
  const findUsersForCourse = (req, res) => {
    const { courseId } = req.params;
    const enrollments = enrollmentsDao.findEnrollmentsForCourse(courseId);
    const users = enrollments
      .map((enrollment) => {
        const user = dao.findUserById(enrollment.user);
        return user;
      })
      .filter((user) => user !== undefined);
    res.json(users);
  };

  // Add a user to a course (enroll them)
  const addUserToCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res
        .status(403)
        .json({ message: "Only faculty can add users to courses" });
      return;
    }
    const { courseId, userId } = req.params;
    const enrollment = enrollmentsDao.enrollUserInCourse(userId, courseId);
    const user = dao.findUserById(userId);
    res.json({ enrollment, user });
  };

  // Remove a user from a course (unenroll them)
  const removeUserFromCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res
        .status(403)
        .json({ message: "Only faculty can remove users from courses" });
      return;
    }
    const { courseId, userId } = req.params;
    const result = enrollmentsDao.unenrollUserFromCourse(userId, courseId);
    if (result) {
      res.json({ message: "User removed from course successfully" });
    } else {
      res.status(404).json({ message: "Enrollment not found" });
    }
  };
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  // People screen routes
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.post("/api/courses/:courseId/users/:userId", addUserToCourse);
  app.delete("/api/courses/:courseId/users/:userId", removeUserFromCourse);

  // Standard user CRUD operations
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);

  // Authentication routes
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
