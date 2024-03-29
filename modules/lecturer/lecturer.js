const db = require("./lecturerDB");
const Validate = require("../../validator")

class Lecturer {
	async getAllLecturers(req, res) {
		try {
			const retVal = await db.getAllLecturers();
			if (retVal == null) {
				res.status(400).json({ Error: "DB Response Was Null" });
			}
			res.status(200).send(retVal);
		} catch (error) {
			res.status(400).json({ Error: error });
			console.log(error);
		}
	}

	async getLecturers(req, res) {
		try {
			const { DepartmentId, Status, Name } = req.body;
			const retVal = await db.getLecturers(DepartmentId, Status, Name);

			if (retVal == null) {
				res.status(400).json({
					Error: db.getError() === null ? "DB Response was Null" : db.getError()
				});
			}
			res.status(200).send(retVal);
		} catch (error) {
			res.status(400).json({ Error: error });
			console.log(error);
		}
	}

	async addLecturer(req, res) {
		try {

			if (!Validate.lecturer(req.body)) return res.status(400).json({ Error: Validate.error[0] });

			const retVal = await db.addLecturer(req.body);
			if (retVal === null) {
				return res.status(400).json({ Error: db.getError() })
			}
			res.status(200).json({ IsSuccessFul: true })
		} catch (error) {
			res.status(400).json({ Error: error });
			console.log(error);
		}
	}

	async getLecturer(req, res) {
		try {
			const lecturerId = req.params.id;
			const retVal = await db.getLecturer(lecturerId);
			if (retVal == null) {
				return res.status(400).json({ Error: "DB Response Was Null" });
			}
			res.status(200).send(retVal);
		} catch (error) {
			res.status(400).json({ Error: error });
			console.log(error);
		}
	}


	async removeLecturer(req, res) {
		try {
			// Fix this delete courses
			const lecturerId = req.params.id;
			const retVal = await db.removeLecturer(lecturerId);
			if (retVal === null) {
				return res.status(400).json({ Error:  db.getError() || "DB Response Was Null" });
			}
			res.status(200).send(retVal);
		} catch (error) {
			res.status(400).json({ Error: error });
			console.log(error);
		}
	}


	async editLecturer(req, res) {
		try {
			if (!Validate.lecturer(req.body)) return res.status(400).json({ Error: Validate.error[0] });

			if (!await db.editLecturer(req.body)) {
				return res.status(400).json({ Error: db.getError() })
			}
			res.status(200).json({ IsSuccessFul: true });
		} catch (error) {
			res.status(400).json({ Error: error })
			console.log(error);
		}
	}

}


module.exports = new Lecturer;