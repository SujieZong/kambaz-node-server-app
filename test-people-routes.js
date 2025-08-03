// Test script for People screen functionality
// This script can be used to test the new routes for managing users in courses

const testRoutes = [
  {
    description: "Get all users enrolled in a course",
    method: "GET",
    url: "/api/courses/RS101/users",
    note: "Returns all users enrolled in course RS101",
  },
  {
    description: "Get all users in the system",
    method: "GET",
    url: "/api/users",
    note: "Returns all users for faculty to manage",
  },
  {
    description: "Get specific user details",
    method: "GET",
    url: "/api/users/123",
    note: "Returns details for user with ID 123",
  },
  {
    description: "Create a new user (Faculty only)",
    method: "POST",
    url: "/api/users",
    body: {
      username: "new_student",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "STUDENT",
      loginId: "001234567S",
      section: "S101",
    },
    note: "Creates a new user - requires faculty authentication",
  },
  {
    description: "Update user information (Faculty only)",
    method: "PUT",
    url: "/api/users/123",
    body: {
      firstName: "Updated",
      lastName: "Name",
      email: "updated@example.com",
    },
    note: "Updates user information - requires faculty authentication",
  },
  {
    description: "Delete a user (Faculty only)",
    method: "DELETE",
    url: "/api/users/123",
    note: "Deletes a user - requires faculty authentication",
  },
  {
    description: "Add user to course (Faculty only)",
    method: "POST",
    url: "/api/courses/RS101/users/234",
    note: "Enrolls user 234 in course RS101 - requires faculty authentication",
  },
  {
    description: "Remove user from course (Faculty only)",
    method: "DELETE",
    url: "/api/courses/RS101/users/234",
    note: "Removes user 234 from course RS101 - requires faculty authentication",
  },
];

console.log("=== People Screen API Routes ===");
console.log(
  "The following routes have been implemented for the People screen:\n"
);

testRoutes.forEach((route, index) => {
  console.log(`${index + 1}. ${route.description}`);
  console.log(`   ${route.method} ${route.url}`);
  if (route.body) {
    console.log(`   Body: ${JSON.stringify(route.body, null, 2)}`);
  }
  console.log(`   Note: ${route.note}\n`);
});

console.log("=== Authentication Requirements ===");
console.log("- Faculty role required for: creating, updating, deleting users");
console.log("- Faculty role required for: adding/removing users from courses");
console.log("- All users can view: user lists and course enrollments");
console.log("- Session-based authentication is used");

console.log("\n=== Usage Examples ===");
console.log(
  "1. To see all people in a course: GET /api/courses/{courseId}/users"
);
console.log(
  "2. To add someone to course: POST /api/courses/{courseId}/users/{userId}"
);
console.log(
  "3. To manage all users: GET /api/users (then use POST/PUT/DELETE)"
);
