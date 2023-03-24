class Module {
  constructor(app) {
    this.app = app;
  }
  init() {
    require("./course/courseController")(this.app);
    require("./lecturer/lecturerController")(this.app);
    require('./faculty/facultyController')(this.app);
    require('./department/departmentController')(this.app);
    require('./courseOfStudy/courseOfStudyController')(this.app);
  }
}

module.exports = Module;