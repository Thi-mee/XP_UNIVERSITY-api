const db = require("./courseDB");
const Validator = require('../../validator')

class Course {

  async getAllCourses(req, res) {
    try {
      const retVal = await db.getAllCourses();
      if (retVal == null) {
        return res.status(400).json({ Error: db.getError() ? "DB Response was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async getCourses(req, res) {
    try {
      const isQueryValid = Validator.courseQuery(req.body);
      if (!isQueryValid) return res.status(400).json({ Error: Validator.error[0] });

      const { DepartmentId, Status, Name } = req.body;
      const retVal = await db.getCourses(DepartmentId, Status, Name);
      if (retVal == null) {
        return res.status(400).json({ Error: db.getError() || "DB Response Was Null"});
      }
      if (retVal.length < 1) {
        return res.status(404).json({ Error: "No Courses Found" });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  }

  async getCourse(req, res) {
    try {
      const courseId = req.params.id;
      const retVal = await db.getCourse(courseId);
      if (retVal == null) {
        return res.status(400).json({
          Error: db.getError() ? db.getError() : "DB Response Was Null"
        });
      }
      if (retVal.length === 0) {
        return res.status(404).json({ Error: "Course Not Found" });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async addCourse(req, res) {
    try {
      const course = { ...req.body };
      if (!Validator.course(course)) return res.status(400).json({ Error: Validator.error[0] });

      if (!await db.addCourse(course)) {
        return res.status(400).json({ Error: db.getError() })
      }
      res.status(200).json({ IsSuccessFul: true })
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error });
    }
  }

  async editCourse(req, res) {
    try {
      const course = { ...req.body };

      if (!Validator.course(course)) return res.status(400).json({ Error: Validator.error[0] });

      const retValue = await db.editCourse(course);
      if (retValue == null) {
        return res.status(400).json({ Error: db.getError() });
      }
      res.status(200).json({ IsSuccessFul: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error })
    }
  }

  async removeCourse(req, res) {
    try {
      if (!(req.params.id)) {
        res.status(400).json({ Error: "Please input a valid course Id" });
      }
      await db.removeCourse(req.params.id)
      res.status(200).json({ IsSuccessFul: true });
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

}

module.exports = new Course;