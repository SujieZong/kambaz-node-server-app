import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Create a new assignment for a course
  app.post("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const assignment = { ...req.body, course: courseId };
    const newAssignment = assignmentsDao.createAssignment(assignment);
    res.json(newAssignment);
  });

  // Get all assignments for a course
  app.get("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const assignments = assignmentsDao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  });

  // Get all assignments
  app.get("/api/assignments", (req, res) => {
    const assignments = assignmentsDao.findAllAssignments();
    res.json(assignments);
  });

  // Get a specific assignment by ID
  app.get("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const assignment = assignmentsDao.findAssignmentById(assignmentId);
    if (assignment) {
      res.json(assignment);
    } else {
      res.status(404).json({ message: "Assignment not found" });
    }
  });

  // Update an assignment
  app.put("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const updatedAssignment = assignmentsDao.updateAssignment(
      assignmentId,
      assignmentUpdates
    );
    if (updatedAssignment) {
      res.json(updatedAssignment);
    } else {
      res.status(404).json({ message: "Assignment not found" });
    }
  });

  // Delete an assignment
  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const status = assignmentsDao.deleteAssignment(assignmentId);
    res.json(status);
  });
}
