var lecturer = require("./lecturer");
const express = require("express");
const router = express.Router();

function LecturerController (app) {
  // Get all lecturers
  router.get("/", lecturer.getAllLecturers);
  // Get lecturers by name, facultyId, status or all
  router.post("/", lecturer.getLecturers);
  // Get lecturer by id
  router.get("/:id", lecturer.getLecturer);
  // Add new lecturer
  router.post("/add", lecturer.addLecturer);
  // Update lecturer
  router.put("/", lecturer.editLecturer);
  // Delete lecturer
  router.delete("/:id", lecturer.removeLecturer);

  // use /api/v1/lecturers as base route 
  // for all routes in this controller and pass 
  // as middleware to app
  app.use("/api/v1/lecturers", router);
}

module.exports = LecturerController;