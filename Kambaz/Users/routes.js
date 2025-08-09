import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
export default function UserRoutes(app) {
  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = await courseDao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  const createUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (
      !currentUser ||
      (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN")
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
      (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN")
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
  const findCoursesForUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    if (currentUser.role === "ADMIN") {
      const courses = await courseDao.findAllCourses();
      res.json(courses);
      return;
    }
    let { uid } = req.params;
    if (uid === "current") {
      uid = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(uid);
    res.json(courses);
  };
  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };

  // Get all users enrolled in a specific course (for People screen)
  const findUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(courseId);
    res.json(users);
  };

  // Add a user to a course (enroll them)
  const addUserToCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res
        .status(403)
        .json({ message: "Only faculty can add users to courses" });
      return;
    }
    const { courseId, userId } = req.params;
    const enrollment = await enrollmentsDao.enrollUserInCourse(
      userId,
      courseId
    );
    const user = await dao.findUserById(userId);
    res.json({ enrollment, user });
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/:uid/courses", findCoursesForUser);

  // People screen routes
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.post("/api/courses/:courseId/users/:userId", addUserToCourse);

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
