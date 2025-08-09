import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Create a new assignment for a course
  const createAssignment = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser || currentUser.role !== "FACULTY") {
        res
          .status(403)
          .json({ message: "Only faculty can create assignments" });
        return;
      }
      const { courseId } = req.params;
      const assignment = { ...req.body, course: courseId };
      const newAssignment = await assignmentsDao.createAssignment(assignment);
      res.json(newAssignment);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to create assignment", error: error.message });
    }
  };

  // Get all assignments for a course
  const findAssignmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await assignmentsDao.findAssignmentsForCourse(
        courseId
      );
      res.json(assignments);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch assignments", error: error.message });
    }
  };

  // Get all assignments
  const findAllAssignments = async (req, res) => {
    try {
      const assignments = await assignmentsDao.findAllAssignments();
      res.json(assignments);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch assignments", error: error.message });
    }
  };

  // Get a specific assignment by ID
  const findAssignmentById = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignment = await assignmentsDao.findAssignmentById(assignmentId);
      if (assignment) {
        res.json(assignment);
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch assignment", error: error.message });
    }
  };

  // Update an assignment
  const updateAssignment = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser || currentUser.role !== "FACULTY") {
        res
          .status(403)
          .json({ message: "Only faculty can update assignments" });
        return;
      }
      const { assignmentId } = req.params;
      const assignmentUpdates = req.body;
      const result = await assignmentsDao.updateAssignment(
        assignmentId,
        assignmentUpdates
      );
      if (result.modifiedCount > 0) {
        const updatedAssignment = await assignmentsDao.findAssignmentById(
          assignmentId
        );
        res.json(updatedAssignment);
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update assignment", error: error.message });
    }
  };

  // Delete an assignment
  const deleteAssignment = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser || currentUser.role !== "FACULTY") {
        res
          .status(403)
          .json({ message: "Only faculty can delete assignments" });
        return;
      }
      const { assignmentId } = req.params;
      const result = await assignmentsDao.deleteAssignment(assignmentId);
      if (result.deletedCount > 0) {
        res.json({ message: "Assignment deleted successfully" });
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete assignment", error: error.message });
    }
  };

  // Route handlers
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.get("/api/assignments", findAllAssignments);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
