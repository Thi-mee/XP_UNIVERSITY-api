const db = require("./departmentDB");
const Validate = require("../../validator");

class Course {
  async getAllDepartments(req, res) {
    try {
      const retVal = await db.getAllDepartments();
      if (retVal == null) {
        res.status(400).json({ Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }


  async getDepartments(req, res) {
    try {
      const { FacultyId, Status, Name } = req.body;
      if (!Validate.departmentQuery(req.body)) return res.status(400).json({ Error: Validate.error[0] });
      const retVal = await db.getDepartments(FacultyId, Status, Name);
      if (retVal == null) {
        res.status(400).json({ Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async getDepartment(req, res) {
    try {
      const deptId = req.params.id;
      const retVal = await db.getDepartment(deptId);
      if (retVal == null) {
        return res.status(400).json({
          Error:
            db.getError() === null ? "DB Response Was Null" : db.getError(),
        });
      }
      res.status(200).send(retVal);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error });
    }
  }

  async addDepartment(req, res) {
    try {
      if (!Validate.department(req.body)) return res.status(400).json({ Error: Validate.error[0] });
      const { Name, FacultyId, UniqueId, Code, Status } = req.body;
      const retvalue = await db.addDepartment({ Name, FacultyId, UniqueId, Code, Status });
      if (retvalue == null) {
        return res.status(400).json({ Error: db.getError() || "DB Response Was Null" });
      }

      res.status(200).json({ IsSuccessFul: true, body: retvalue });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error });
    }
  }

  async removeDepartment(req, res) {
    try {
      if (!(req.params.id)) {
        res.status(400).json({ Error: "Please input a valid course Id" });
      }
      const retVal = await db.removeDepartment(req.params.id)
      if (retVal == null) {
        return res.status(400).json({
          Error: db.getError() || "DB Response Was Null"
        });
      }
      res.status(200).json({ IsSuccessFul: true });
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async editDepartment(req, res) {
    try {
      const department = { ...req.body };
      if (department.Name === "" || department.Name.length < 3) {
        res.status(400).json({ Error: "Invalid/Empty Department Name" })
      }
      await db.editDepartment(department);
      res.status(200).json({ IsSuccessFul: true });
    } catch (error) {
      res.status(400).json({ Error: error })
      console.log(error);
    }
  }
}

module.exports = new Course();
