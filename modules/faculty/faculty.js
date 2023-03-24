const db = require("./facultyDB");
const Validate = require("../../validator");

class Faculty {
  getAllFaculties = async (req, res) => {
    const retVal = await db.getAllFaculties();
    if (retVal == null) {
      return res.status(400).json({ Error: db.getError() || "DB Response was Null" });
    }
    res.status(200).send(retVal);
  }

  getFaculty = async (req, res) => {
    const facultyId = req.params.id;
    const retVal = await db.getFaculty(facultyId);
    if (retVal == null) {
      res.status(400).json({ Error: db.getError() || "Faculty not found" });
    } else {
      res.status(200).send(retVal);
    }
  }

  getFaculties = async (req, res) => {
    const { Status, Name } = req.body;

    const isValid = Validate.facultyQuery({ Status, Name });
    if (!isValid) return res.status(400).json({ Error: Validate.error[0] });
    console.log(req.body)
    const retVal = await db.getFaculties(Status, Name);
    if (retVal == null) {
      res
        .status(400)
        .json({ Error: db.getError() || "DB response was null" });
    } else {
      res.status(200).send(retVal);
    }
  }

  addFaculty = async (req, res) => {
    const faculty = { ...req.body };

    const isValid = Validate.faculty(faculty);
    if(!isValid) return res.status(400).json({ Error: Validate.error[0] });

    const retValue = await db.addFaculty(faculty);
    if (retValue == null) { return res.status(400).json({ Error: db.getError() }); }

    const response = {
      ...retValue,
      message: "Faculty created successfully"
    }
    return res.status(200).json(response);

  }

  editFaculty = async (req, res) => {
    try {
      const faculty = { ...req.body };

      if (!Validate.faculty(faculty)) return res.status(400).json({ Error: Validate.error[0] });

      else {
        await db.editFaculty(faculty);
        res.status(200).json({ IsSuccessFul: true });
      }
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }
  removeFaculty = async (req, res) => {
    try {
      const facultyId = req.params.id;
      if (facultyId < 1) {
        res.status(400).json({ Error: "Please input a valid faculty Id" });
      } else {
        const retVal = await db.removeFaculty(facultyId);
        if (retVal == null) {
          return res.status(409).json({ Error: db.getError() || "Faculty wasn't found" });
        }
        res.status(200).json({ IsSuccessFul: true });
      }
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }
}

module.exports = new Faculty;
